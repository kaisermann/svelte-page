import home from "./pages/home.html";
import other from "./pages/other.html";
import things from "./pages/things.html";
import thing from "./pages/thing.html";
import subthing from "./pages/subthing.html";

export default {
  "/": home,
  "/other": other,
  "/things": {
    component: things,
    data: { foo : "This is a foo value" }
  },
  "/things/:thing*": thing,
  "/things/:thing/subthing/": subthing,
}