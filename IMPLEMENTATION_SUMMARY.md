# Schema Tissulaire avec SAR Certificate Implementation

## Overview
This implementation adds a new certificate option for "Schema Tissulaire avec SAR" (Class 3 T vaccine) to the certnat Firefox extension. The implementation follows the same pattern as the existing Essen3 and Zagreb3 certificates.

## Files Created
1. `schema-tissulaire-avec-sar-certificat.html` - HTML template for the certificate
2. `schema-tissulaire-avec-sar-certificat.js` - JavaScript file to handle certificate functionality

## Files Modified
1. `manifest.json` - Added the new HTML and JS files to web_accessible_resources
2. `certificat.js` - Added new functions and updated UI to include the new certificate option

## Implementation Details

### New Functions Added
- `vaccint3(dateMorsure, poidsInput)` - Opens the new HTML file with certificate data
- Updated `demanderPoidsT()` - Now opens a schema choice modal instead of directly calling Tissulaireavecsar
- Updated `ouvrirModalClasse03()` - Improved button labels for clarity
- Updated `ouvrirModalChoixSchema()` - Added "Tissulaire avec SAR" option

### Data Flow
1. User selects "Classe 03" then "Vaccin T (Tissulaire)"
2. User enters patient weight and date of bite
3. User selects "Tissulaire avec SAR" from schema options
4. Certificate is displayed in new HTML page
5. User can save the certificate, which sends data to the native application
6. Data is saved to the antirabique table in data.db with:
   - type_de_vaccin: 'Tissulaire'
   - shema: 'Tissulaire avec SAR'
   - classe: '03'

### UI Changes
- Updated button labels in Classe 03 modal to be more descriptive
- Added "Tissulaire avec SAR" option to schema choice modal

## Testing
To test this implementation:
1. Open the Firefox extension
2. Navigate to the certificate generation page
3. Select "Classe 03"
4. Click on "Vaccin T (Tissulaire)"
5. Enter a patient weight and date of bite
6. Select "Tissulaire avec SAR" from the schema options
7. Verify that the certificate is displayed correctly
8. Click the save button and verify that the data is saved to the antirabique table in the database