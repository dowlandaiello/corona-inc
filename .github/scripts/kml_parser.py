import xmltodict
import sys
import json


def get_coordinate_pairs(l):
    result = []

    for unformatted_coordinate_pair in l:
        coordinate_list = unformatted_coordinate_pair.split(",")
        coordinate_map = {}

        coordinate_map["lat"] = float(coordinate_list[1])
        coordinate_map["lng"] = float(coordinate_list[0])

        result.append(coordinate_map)

    return result


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
                "border": get_coordinate_pairs(border["outerBoundaryIs"]["LinearRing"]["coordinates"].split(",0 "))
            }

            result[parsed["identifier"]] = parsed

    json.dump(result, out, sort_keys=True)
