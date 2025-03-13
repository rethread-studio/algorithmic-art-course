# Sample project to experiment with cadavre exquis artworks

This folder includes a sandbox to experiment with two gen art pieces to be included in the IFT6251 [exquisite corpse](https://en.wikipedia.org/wiki/Exquisite_corpse).

To design, experiment and tune your own artworks:

- ```exquisite-conductor.html```: nothing to change
- ```exquisite-conductor.js```: nothing to change
- ```exquisitebw.js```,```exquisitered.js```: they are examples of code structures. You must no reuse them. Write your own two artworks.
- ```exquisite.json```: replace by the name of your own artworks: the name of the code file for the artwork ("art_code"), the name of the function that initializes the artwork ("art_set") and the name of the function that actually generates the artwork ("art_gen")
- Global variables to use:
  - ```O_currentsection```: the object that has all data for the section in which you draw your artwork
  - ```O_sectionduration```: the duration during which your artwork draws
  - ```O_sectionheight```: height of the section in which you draw
  - ```O_sectionwidth```: width of the section in which you draw
  - a section object has different fields
    - ```x```, ```y```: the coordinates of the top left corner for the section
    - ```x1```, ```y1```: a point on the top edge of section (to anchor with the artwork on top of yous)
    - ```x2```, ```y2```: a point on the right edge of section (to anchor with the artwork on right of yous)
    - ```x3```, ```y3```: a point on the bottom edge of section (to anchor with the artwork on bottom of yous)
    - ```x4```, ```y4```: a point on the left edge of section (to anchor with the artwork on left of yous)
    - ```id```: a unique id (between 0 and 26) for your section
 
