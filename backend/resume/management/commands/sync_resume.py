"""
Applies backend/resume/data/resume.json to the database.

The site's experience is database content, not code, so updating it means
changing rows. Doing that by hand through the admin is error-prone and leaves
no record of what changed; this keeps the resume under version control and
makes applying it repeatable and reviewable.

It never deletes. Records present in the database but absent from the JSON are
reported so they can be removed deliberately, because only the owner knows
whether an unmatched row is stale or simply something the resume omits.
"""

import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from resume.models import Certification, Education, Job

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "resume.json"

# Fields that identify an existing row. Everything else is overwritten from the
# JSON, so edits made in the admin to non-key fields will not survive a sync.
JOB_KEYS = ("company", "title", "start_date")
EDUCATION_KEYS = ("institution", "degree")
CERTIFICATION_KEYS = ("name", "issuing_organization")


class Command(BaseCommand):
    help = "Create or update Job, Education and Certification rows from resume.json"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Report what would change without writing anything.",
        )
        parser.add_argument(
            "--file",
            default=str(DATA_FILE),
            help=f"Path to the resume JSON (default: {DATA_FILE}).",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        path = Path(options["file"])

        if not path.exists():
            self.stderr.write(self.style.ERROR(f"No resume data at {path}"))
            return

        data = json.loads(path.read_text(encoding="utf-8"))

        with transaction.atomic():
            self._sync(Job, data.get("jobs", []), JOB_KEYS, "job")
            self._sync(Education, data.get("education", []), EDUCATION_KEYS, "education record")
            self._sync(
                Certification,
                data.get("certifications", []),
                CERTIFICATION_KEYS,
                "certification",
            )

            if dry_run:
                self.stdout.write(self.style.WARNING("\nDry run: rolling back."))
                transaction.set_rollback(True)

    def _sync(self, model, records, keys, label):
        if not records:
            self.stdout.write(f"\nNo {label} entries in the data file; skipping.")
            return

        self.stdout.write(self.style.MIGRATE_HEADING(f"\n{label.title()}s"))

        seen = []
        for record in records:
            lookup = {key: record[key] for key in keys}
            defaults = {k: v for k, v in record.items() if k not in keys}

            obj, created = model.objects.update_or_create(**lookup, defaults=defaults)
            seen.append(obj.pk)

            verb = "created" if created else "updated"
            style = self.style.SUCCESS if created else self.style.HTTP_INFO
            self.stdout.write(style(f"  {verb}: {obj}"))

        # Never deleted automatically: an unmatched row may be stale, or may be
        # something deliberately kept that the resume does not mention.
        unmatched = model.objects.exclude(pk__in=seen)
        if unmatched.exists():
            self.stdout.write(
                self.style.WARNING(
                    f"\n  {unmatched.count()} existing {label}(s) not in the data file. "
                    f"Review and remove in the admin if stale:"
                )
            )
            for obj in unmatched:
                self.stdout.write(self.style.WARNING(f"    [id {obj.pk}] {obj}"))
