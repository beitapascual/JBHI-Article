"""Generate the static site's figures, downloads and data from materials/."""
import csv
import json
import re
from pathlib import Path
from shutil import copyfile
from zipfile import ZipFile

from openpyxl import load_workbook
from PIL import Image

WEBSITE = Path(__file__).resolve().parents[1]
REPOSITORY = WEBSITE.parent
DATA = WEBSITE / "src/data"
OUTPUT = WEBSITE / "public/science"
SOURCES = json.loads((DATA / "material-sources.json").read_text(encoding="utf-8"))


def source_path(entry):
    return REPOSITORY / entry["source"]


def prepare_figure(key, entry):
    source = source_path(entry)
    copyfile(source, OUTPUT / entry["file"])
    with Image.open(source) as figure:
        width, height = figure.size
        image = figure.convert("RGBA")
        preview = Image.new("RGB", image.size, "white")
        preview.paste(image, mask=image.getchannel("A"))
        preview.thumbnail((1450, 1350), Image.Resampling.LANCZOS)
        preview_width, preview_height = preview.size
        preview.save(OUTPUT / f"{key}.webp", quality=91, method=6)
        preview.thumbnail((620, 340), Image.Resampling.LANCZOS)
        preview.save(OUTPUT / f"{key}-thumb.webp", quality=86, method=6)
    return {
        **entry, "width": width, "height": height,
        "previewWidth": preview_width, "previewHeight": preview_height,
    }


def prepare_download(key, entry):
    source = source_path(entry)
    target = OUTPUT / entry["file"]
    if key != "epochs-older":
        copyfile(source, target)
        return
    # The original workbook remains in materials/. The website download omits
    # the absolute Excel project path in its metadata.
    path_metadata = re.compile(
        rb"<mc:AlternateContent[^>]*>\s*<mc:Choice[^>]*>\s*"
        rb"<x15ac:absPath[^>]*/>\s*</mc:Choice>\s*</mc:AlternateContent>"
    )
    with ZipFile(source) as original, ZipFile(target, "w") as download:
        for member in original.infolist():
            contents = original.read(member)
            if member.filename == "xl/workbook.xml":
                contents = path_metadata.sub(b"", contents)
            download.writestr(member, contents)


def prepare_table(key, entry):
    prepare_download(key, entry)
    source = source_path(entry)
    if source.suffix == ".csv":
        with source.open(encoding="utf-8-sig", newline="") as file:
            heading, *rows = csv.reader(file, delimiter=";")
        heading = [
            "Successful-trial epochs (%)" if header == "Correct trials (%)" else header
            for header in heading
        ]
        return {**entry, "heading": heading, "rows": rows}
    if key in ("table-s5", "table-s6"):
        book = load_workbook(source, read_only=True, data_only=True)
        first, last = (3, 7) if key == "table-s5" else (1, 8)
        heading, *rows = book["Summary"].iter_rows(min_row=first, max_row=last, values_only=True)
        book.close()
        if key == "table-s6":
            rows = [
                [*row[:3], f"{row[3]:.1%}" if isinstance(row[3], float) else row[3]]
                for row in rows
            ]
        return {**entry, "heading": heading, "rows": rows}
    return entry


def ica_effects():
    book = load_workbook(source_path(SOURCES["tables"]["ica-contrasts"]), read_only=True, data_only=True)
    effects = [
        {
            "contrast": sheet.title, "band": band, "region": region,
            "original": original, "adjustedOriginal": original_p,
            "corrected": corrected, "adjustedCorrected": corrected_p,
        }
        for sheet in book
        for band, region, original, original_p, corrected, corrected_p
        in sheet.iter_rows(min_row=2, max_row=11, max_col=6, values_only=True)
    ]
    book.close()
    return effects


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    generated = {
        "assets": {key: prepare_figure(key, value) for key, value in SOURCES["figures"].items()},
        "tables": {key: prepare_table(key, value) for key, value in SOURCES["tables"].items()},
        "ica-effects": ica_effects(),
    }
    for name, contents in generated.items():
        (DATA / f"{name}.json").write_text(
            json.dumps(contents, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )


if __name__ == "__main__":
    main()
