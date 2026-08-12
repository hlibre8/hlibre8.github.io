/*
  Glass page gallery source list.

  Add a new image to assets/images/gallery/, duplicate one object below, then
  edit image, title, date, and type. Commit and push; the Glass page reads this
  file directly, so new images display without a generated metadata file.

  type must be either "Photography" or "Glass".
  Optional fields: location, orderOverride, colorOverride, featured, caption.
  Location is manual only; EXIF GPS data is never read or exposed automatically.
*/
window.GALLERY_SOURCE_ITEMS = [
  /*
    white sands dune
  */
  {
    image: "assets/images/gallery/20240713_192630_Original.jpg",
    title: "Dune",
    date: "2024",
    type: "Photography",
    location: "White Sands National Park, New Mexico",
    orderOverride: null,
    colorOverride: null,
    featured: false
  },
  /*
    big bend
  */
  {
    image: "assets/images/gallery/20240722_122214_Original.jpg",
    title: "",
    date: "2024",
    type: "Photography",
    location: "Big Bend National Park, Texas",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    zurich museum
  */
  {
    image: "assets/images/gallery/DSC02667.JPG",
    title: "",
    date: "2026",
    type: "Photography",
    location: "Zurich, Switzerland",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    streets of bern, switzerland
  */
  {
    image: "assets/images/gallery/DSC02722.JPG",
    title: "",
    date: "2026",
    type: "Photography",
    location: "Bern, Switzerland",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    library at university of zurich, switzerland
  */
  {
    image: "assets/images/gallery/IMG_0271.jpg",
    title: "",
    date: "2026",
    type: "Photography",
    location: "University of Zurich, Zurich, Switzerland",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    foggy treeline at Smokey Mountains NP, tennessee
  */
  {
    image: "assets/images/gallery/IMG_1969.jpg",
    title: "Foggy Treeline",
    date: "2026",
    type: "Photography",
    location: "Great Smoky Mountains National Park, Tennessee",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    dune at white sands NP, NM
  */
  {
    image: "assets/images/gallery/IMG_2301.jpg",
    title: "Dune",
    date: "2024",
    type: "Photography",
    location: "White Sands National Park, New Mexico",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    crystals at S&T physics dept
  */
  {
    image: "assets/images/gallery/IMG_8061-1152x1536.jpg",
    title: "Crystals",
    date: "2024",
    type: "Photography",
    location: "Missouri S&T, Rolla, Missouri",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    ha ha tonka SP, MO
  */
  {
    image: "assets/images/gallery/R1-06950-005A_Original.jpg",
    title: "",
    date: "2026",
    type: "Photography",
    location: "Ha Ha Tonka State Park, Missouri",
    orderOverride: null,
    colorOverride: null,
    featured: true
  },
  /*
    out of focus flowers
  */
  {
    image: "assets/images/gallery/R1-06950-008A_Original.jpg",
    title: "Flowers",
    date: "2026",
    type: "Photography",
    location: "Rolla, Missouri",
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
    location: "St. Louis, Missouri",
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
    location: "Laguna Beach, California",
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
    location: "Los Angeles, California",
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
    location: "Ironton, Missouri",
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
    location: "Elephant Rocks State Park, Missouri",
    orderOverride: null,
    colorOverride: null,
    featured: true
  }
];
