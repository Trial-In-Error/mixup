# Mixup
A tool for generating PDF bingo cards with arbitrary, custom cells.

### Features
- Arbitrary row and column counts
- Optionally generate from seed for replicable results
- Custom paper sizes (half-implemented)
- Arbitrary number, location, and text on "free" spaces
- Configurable in node-config standard with CLI overrides

### Possible improvements
- Fully support custom paper sizes (contribute back to pdfkit?)
- Write driver script for generating multiple at a time ("count"?)
- Error checking for too-few options
- Error checking for out-of-bounds free spaces
- Customizable formatting for free spaces
- Customizable formatting for normal spaces
- Customizable header / title section
