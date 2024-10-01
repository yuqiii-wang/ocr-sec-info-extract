import json

bbg_script_template="""# Below are generated shell scripts
today=$(date '+%Y-%m-%d')
echo '{csv_data}' > data/BulkStaticImporter/BSI${{today}}.csv
sleep 5
grep '{csv_data}' log/BulkStaticImporter/BSI${{today}}.log
"""

def convert_to_shell_script_BBG(ocr_json):
    csv_data_list = []
    for key in ocr_json:
        if key == 'Coupon':
            if ocr_json[key] == 'S/A':
                csv_data_list.append(2)
        else:
            csv_data_list.append(ocr_json[key])
    bbg_script = bbg_script_template.format(csv_data="|".join(csv_data_list))
    return bbg_script