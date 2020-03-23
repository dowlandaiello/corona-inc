import xmltodict
import sys
import json

if __name__ != "__main__" or len(sys.argv) < 3:
    print("A file must be supplied from which data will be read, alongside a desired output buffer.")

    exit(1)

with open(sys.argv[1]) as f, open(sys.argv[2], "w+") as out:
    doc = xmltodict.parse(f.read())
    result = {}

    for placegroup in doc["kml"]["Document"]["Folder"][1]["Folder"][1:]:
        for place in placegroup["Placemark"]:
            border = place["MultiGeometry"]["Polygon"][-1] if "Polygon" not in place else place["Polygon"]

            parsed = {
                "identifier": place["name"],
                "border": border["outerBoundaryIs"]["LinearRing"]["coordinates"].split(",")
            }

            result[parsed["identifier"]] = parsed

    json.dump(result, out, sort_keys=True)

