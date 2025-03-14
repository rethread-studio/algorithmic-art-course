# Sample project to experiment with cadavre exquis artworks

This folder includes a sandbox to experiment with two gen art pieces to be included in the IFT6251 [exquisite corpse](https://en.wikipedia.org/wiki/Exquisite_corpse).

To design, experiment and tune your own artworks:

- `exquisite-conductor.html`: Nothing to change.
- `exquisite-conductor.js`: Nothing to change.
- `exquisitebw.js`,`exquisitered.js`: They are examples of code structures. You must no reuse them. Write your own two artworks.
- `exquisite.json`: Add your own artworks. The `art_code` key should be the name of your js file **without** the extension.
- Global variables to use:
  - `O_currentsection`: The object that has all data for the section in which you draw your artwork. A section object has different fields
    - `x`, `y`: The coordinates of the top left corner for the section.
    - `x1`, `y1`: A point on the top edge of section (to anchor with the artwork on top of yours).
    - `x2`, `y2`: A point on the right edge of section (to anchor with the artwork on right of yours).
    - `x3`, `y3`: A point on the bottom edge of section (to anchor with the artwork on bottom of yours).
    - `x4`, `y4`: A point on the left edge of section (to anchor with the artwork on left of yours).
    - `id`: A unique id (between 0 and 26) for your section.
  - `O_sectionduration`: The duration during which your artwork draws.
  - `O_sectionheight`: Height of the section in which you draw.
  - `O_sectionwidth`: Width of the section in which you draw.
