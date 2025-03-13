# Cadavre exquis, a.k.a exquisite corpse, for a collective generative artwork

This folder includes scaffolding code to build a collective generative artwork in the spirit of surrealists' [exquisite corpse](https://en.wikipedia.org/wiki/Exquisite_corpse) (from the original French term cadavre exquis)

This scaffolding includes three files:

- exquisite-conductor.html: the page for the corpse, which loads all generative art sketches that will compose the corpse
- exquisite-conductor.js: the overarching sketch, which builds the global canvas for the corpse, divides it into different sections and conducts / schedules the different generative artwokrs
- exquisite.json: the configuration file that includes all generative artworks. Each artwork is defined as follows: the name of the code file for the artwork ("art-code"), the name of function that initializes the artwork ("art-set") and the name of the function that actually generates the artwork ("art-gen")

Parameters for the exquisite corpse, in exquisite-conductor.js
- O_widthexquis, O_heightexquis: width and height of the global canvas on which the corpse is drawn
- O_nbsectionshorizontal, O_nbsectionsvertical: number of canvas subdivisions, horizontally and vertically
- initsections(): decide on the data model to describe a section. Default behavior: a section has an (x,y) upper left origin; 4 randomly picker anchor point on the top, right, bottom and left edges of the section; a unique id.
- O_configurationexquise: the configuration file that describes the different generative artworks
- O_sectionduration: duration (in number of frames) for each art work.
- the art works: this repo has only 2 works that can serve as examples. These works can be any generative artwork. Only two constraints: don't forget to translate at the location of the O_currentsection; don't redefine functions names '''draw''' or '''setup'''