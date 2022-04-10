import { Component, OnInit } from "@angular/core";
import * as AOS from "aos";
@Component({
  selector: "app-landingpage",
  templateUrl: "./landingpage.component.html",
  styleUrls: ["./landingpage.component.scss"],
})
export class LandingpageComponent implements OnInit {
  constructor() {}
  images = [62, 83, 466, 965, 982, 1043, 738].map(
    (n) => `https://picsum.photos/id/${n}/900/500`
  );
  ngOnInit(): void {
    AOS.init();
  }
  toHome() {
    document.getElementById("inicio").scrollIntoView({ behavior: "smooth" });
  }
  toServices() {
    document.getElementById("servicios").scrollIntoView({ behavior: "smooth" });
  }
  toAbout() {
    document.getElementById("aboutus").scrollIntoView({ behavior: "smooth" });
  }
  toContact() {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  }
}
