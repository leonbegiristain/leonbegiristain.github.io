// Add a publication by putting a new object at the TOP of this list.
//
// Fields:
//   title       string
//   authors     array of names. Your name (see NAME match in js/main.js) is bolded automatically.
//   venue       string, e.g. "NeurIPS 2026" or "Preprint"
//   year        number, used for sorting (newest first)
//   figure      path to an image in assets/ (optional; a placeholder is shown if omitted)
//   description 1–2 sentence summary
//   links       any subset of: paper, arxiv, code, project, bibtex, poster, slides, video
//   selected    true to give the card a subtle highlight (optional)
window.PUBLICATIONS = [
  {
    title: "CRONOS: Benchmarking Counterfactual Physical Consistency in Video Models",
    authors: ["Leon Begiristain", "Olaf Dünkel", "Adam Kortylewski"],
    venue: "Preprint",
    year: 2026,
    figure: "assets/pub-placeholder.svg",
    description:
      "CRONOS evaluates the ability of video models to generate physically consistent outcomes under visual interventions of the input.",
    links: {
      paper: "https://arxiv.org/abs/2605.23699",
      project: "https://genintel.github.io/CRONOS/",
      code: "https://github.com/GenIntel/CRONOS-benchmark",
    },
    selected: true,
  },
  {
    title: "UnrealSpace: Analyzing Spatial Understanding and Reasoning in Controllable Simulation",
    authors: ["Wufei Ma", "et. al."],
    venue: "CVPR 2026 Findings",
    year: 2026,
    figure: "assets/pub-placeholder.svg",
    description:
      "UnrealSpace presents a framework to unify the evaluation of multiple spatial understanding and reasoning tasks.",
    links: {
      paper: "https://openaccess.thecvf.com/content/CVPR2026F/papers/Ma_UnrealSpace_Analyzing_Spatial_Understanding_and_Reasoning_in_Controllable_Simulation_CVPRF_2026_paper.pdf",
      code: "#",
      bibtex: "#",
    },
  },
  {
    title: "Droid-splat: combining end-to-end slam with 3d gaussian splatting",
    authors: ["Christian Homeyer", "Leon Begiristain", "Christoph Schnörr"],
    venue: "ICCV 2025 Workshop",
    year: 2025,
    figure: "assets/pub-placeholder.svg",
    description:
      "Combining end-to-end SLAM tracker with monocular depth priors and 3D Gaussian Splatting rendering.",
    links: {
      paper: "https://arxiv.org/pdf/2411.17660",
      code: "https://github.com/ChenHoy/DROID-Splat"
    },
  },
];
