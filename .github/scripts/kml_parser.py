import xmltodict
import sys
import json


def get_border_and_path(l):
    border = {}
    path = []

    for unformatted_coordinate_pair in l:
        coordinate_list = unformatted_coordinate_pair.split(",")

        lat = float(coordinate_list[1])
        lng = float(coordinate_list[0])

        if round(lng) not in border:
            border[round(lng, 2)] = [lat]
        else:
            border[round(lng, 2)].append(lat)

        path.append({"lat": lat, "lng": lng})

    return {"border": border, "path": path}


if __name__ != "__main__" or len(sys.argv) < 3:
    print("A file must be supplied from which data will be read, alongside a desired output buffer.")

    exit(1)

with open(sys.argv[1]) as f, open(sys.argv[2], "w+") as out:
    doc = xmltodict.parse(f.read())
    result = {}

    for placegroup in doc["kml"]["Document"]["Folder"][1]["Folder"][1:]:
        for place in placegroup["Placemark"]:
            border = sorted(place["MultiGeometry"]["Polygon"], key=lambda border_poly: len(border_poly["outerBoundaryIs"]["LinearRing"]["coordinates"]))[
                -1] if "Polygon" not in place else place["Polygon"]

            border_path = get_border_and_path(
                border["outerBoundaryIs"]["LinearRing"]["coordinates"].split(",0 "))

            parsed = {
                "identifier": place["name"],
                "border": border_path["border"],
                "path": border_path["path"]
            }

            result[parsed["identifier"]] = parsed

    json.dump(result, out, sort_keys=True)
