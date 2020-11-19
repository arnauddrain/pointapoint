import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  points: { x: number, y: number }[] = [];
  showLines: boolean = true;
  showImage: boolean = true;
  width = 200;
  height = 200;
  _backgroundUrl: string = '';

  onClick(event: any) {
    this.points.push({
      x: event.offsetX,
      y: event.offsetY
    });
  }

  undo() {
    this.points.pop();
  }

  getLines() {
    const lines = [];
    for (var i = 1; i < this.points.length; i++) {
      lines.push({
        x1: this.points[i - 1].x,
        y1: this.points[i - 1].y,
        x2: this.points[i].x,
        y2: this.points[i].y
      });
    }
    return lines;
  }

  set backgroundUrl(value: string) {
    this._backgroundUrl = value;
    const image = new Image();
    image.onload = (event) => {
      const loadedImage: any = event.currentTarget;
      this.width = loadedImage.width;
      this.height = loadedImage.height;
    }
    image.src = this.backgroundUrl;
  }

  get backgroundUrl(): string {
    return this._backgroundUrl;
  }

  save() {
    const svg = document.getElementById('canvas');
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg);

    //add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    //convert svg source to URI data scheme.
    var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

    //set url value to a element's href attribute.
    (document.getElementById("link") as HTMLLinkElement).href = url;
    (document.getElementById("link") as HTMLLinkElement).click();
  }
}
