/*
  Glass page gallery source list.

  Add a new image to assets/images/gallery/, duplicate one object below, then
  edit image, title, date, and type. Run `python3 scripts/analyze-gallery.py`
  afterward; the generated gallery order will update automatically.

  type must be either "Photography" or "Glass".
  Optional fields: location, orderOverride, colorOverride, featured, caption.
  Location is manual only; the analyzer does not read or expose EXIF GPS data.
*/
window.GALLERY_SOURCE_ITEMS = [
  /*
    white sands dune
  */
  {
    image: "assets/images/gallery/20240713_192630_Original.jpg",
    title: "white sands dune national park, new mexico",
    date: "2024",
    type: "Photography",
    location: "",
    orderOverride: null,
    colorOverride: null,
    featured: false
  },
  /*
    big bend
  */
  {
    image: "assets/images/gallery/20240722_122214_Original.jpg",
    title: "big bend national park, texas",
    date: "2024",
    type: "Photography",
    location: "",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    zurich museum
  */
  {
    image: "assets/images/gallery/DSC02667.JPG",
    title: "zurich, switzerland",
    date: "2026",
    type: "Photography",
    location: "",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    streets of bern, switzerland
  */
  {
    image: "assets/images/gallery/DSC02722.JPG",
    title: "bern, switzerland",
    date: "2026",
    type: "Photography",
    location: "",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    library at university of zurich, switzerland
  */
  {
    image: "assets/images/gallery/IMG_0271.jpg",
    title: "zurich, switzerland",
    date: "2026",
    type: "Photography",
    location: "",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    foggy treeline at Smokey Mountains NP, tennessee
  */
  {
    image: "assets/images/gallery/IMG_1969.jpg",
    title: "smokey mountains national park, tennessee",
    date: "2026",
    type: "Photography",
    location: "",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    dune at white sands NP, NM
  */
  {
    image: "assets/images/gallery/IMG_2301.jpg",
    title: "white sands national park, new mexico",
    date: "2024",
    type: "Photography",
    location: "",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    crystals at S&T physics dept
  */
  {
    image: "assets/images/gallery/IMG_8061-1152x1536.jpg",
    title: "rolla, missouri",
    date: "2024",
    type: "Photography",
    location: "",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    ha ha tonka SP, MO
  */
  {
    image: "assets/images/gallery/R1-06950-005A_Original.jpg",
    title: "osage beach, missouri",
    date: "2026",
    type: "Photography",
    location: "",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    out of focus flowers
  */
  {
    image: "assets/images/gallery/R1-06950-008A_Original.jpg",
    title: "rolla, missouri",
    date: "2026",
    type: "Photography",
    location: "",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    stl street corner
  */
  {
    image: "assets/images/gallery/R1-06950-020A_Original.jpg",
    title: "",
    date: "2025",
    type: "Photography",
    location: "st.louis, missouri",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    laguna beach, CA
  */
  {
    image: "assets/images/gallery/R1-07593-0009.JPG",
    title: "",
    date: "2025",
    type: "Photography",
    location: "laguna beach, california",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    street near the last bookstore, CA
  */
  {
    image: "assets/images/gallery/R1-07593-0014.JPG",
    title: "",
    date: "2025",
    type: "Photography",
    location: "los angeles, california",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    campsite in Ironton, MO
  */
  {
    image: "assets/images/gallery/R1-07593-0018.JPG",
    title: "",
    date: "2026",
    type: "Photography",
    location: "ironton, missouri",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    Elephant Rocks SP, MO
  */
  {
    image: "assets/images/gallery/R1-07593-0020.JPG",
    title: "",
    date: "2026",
    type: "Photography",
    location: "ironton, missouri",
    orderOverride: null,
    colorOverride: null,
    featured: true
  }
];
