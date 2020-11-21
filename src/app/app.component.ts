import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  points: { x: number, y: number }[] = [];
  showLines: boolean = true;
  showImage: boolean = true;
  width = 200;
  height = 200;
  _spacing: number;
  _fontSize: number;
  _backgroundUrl: string;

  ngOnInit() {
    this.backgroundUrl = localStorage.getItem('backgroundUrl');
    this.points = JSON.parse(localStorage.getItem('points')) ?? [];
    this.spacing = Number(localStorage.getItem('spacing') ?? '2');
    this.fontSize = Number(localStorage.getItem('fontSize') ?? '10');
  }

  savePoints() {
    localStorage.setItem('points', JSON.stringify(this.points));
  }

  onClick(event: any) {
    this.points.push({
      x: event.offsetX,
      y: event.offsetY
    });
    this.savePoints();
  }

  undo() {
    this.points.pop();
    this.savePoints();
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
    localStorage.setItem('backgroundUrl', value);
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

  set fontSize(value: number) {
    this._fontSize = value;
    localStorage.setItem('fontSize', value.toString());
  }

  get fontSize(): number {
    return this._fontSize;
  }

  set spacing(value: number) {
    this._spacing = value;
    localStorage.setItem('spacing', value.toString());
  }

  get spacing(): number {
    return this._spacing;
  }

  save() {
    const svg = document.getElementById('canvas');
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

    (document.getElementById("link") as HTMLLinkElement).href = url;
    (document.getElementById("link") as HTMLLinkElement).click();
  }
}
