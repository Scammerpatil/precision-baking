import pandas as pd
import re

# Load the second worksheet
file_path = 'python/database.xlsx'
xls = pd.ExcelFile(file_path)
df_raw = pd.read_excel(xls, sheet_name=1)

# Drop empty rows
df_cleaned = df_raw.dropna(how='all')

# Auto-detect header row containing "Density"
for i, row in df_cleaned.iterrows():
    if "Density" in str(row).lower():
        df_cleaned.columns = row
        df_cleaned = df_cleaned[i+1:]
        break

# Drop empty columns and unnamed
df_cleaned = df_cleaned.dropna(axis=1, how='all')
df_cleaned = df_cleaned.loc[:, ~df_cleaned.columns.astype(str).str.contains("Unnamed")]

# Rename and keep only required columns
df_cleaned = df_cleaned.rename(columns={
    list(df_cleaned.columns)[0]: 'food',
    list(df_cleaned.columns)[1]: 'density'
})

# Drop unnecessary columns if present
df_cleaned = df_cleaned[['food', 'density']]

# Drop rows with missing food or density
df_cleaned = df_cleaned.dropna(subset=['food', 'density'])

# Handle density ranges like '0.56-0.72' or '0.56–0.72'
def parse_density(val):
    if isinstance(val, str):
        match = re.match(r"^\s*(\d+(\.\d+)?)\s*[-–]\s*(\d+(\.\d+)?)\s*$", val)
        if match:
            low = float(match.group(1))
            high = float(match.group(3))
            return round((low + high) / 2, 5)
    try:
        return float(val)
    except:
        return None

df_cleaned['density'] = df_cleaned['density'].apply(parse_density)

# Drop any rows where density could not be parsed
df_cleaned = df_cleaned.dropna(subset=['density'])

# Reset index
df_cleaned = df_cleaned.reset_index(drop=True)

# Save cleaned CSV
output_csv = 'python/density_data.csv'
df_cleaned.to_csv(output_csv, index=False)

print(f"✅ Final cleaned CSV saved to: {output_csv}")
