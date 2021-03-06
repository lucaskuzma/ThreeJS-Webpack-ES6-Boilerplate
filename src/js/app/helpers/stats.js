// Local vars for rStats
let rS, bS, glS, tS;

export default class Stats {
  constructor(renderer) {
    this.renderer = renderer;
  
    bS = new BrowserStats();
    glS = new glStats();
    tS = new threeStats(this.renderer.threeRenderer);

    rS = new rStats({
      CSSPath: './assets/css/',
      userTimingAPI: true,
      values: {
        frame: { caption: 'Total frame time (ms)', over: 16, average: true, avgMs: 100 },
        fps: { caption: 'Framerate (FPS)', below: 30 },
        calls: { caption: 'Calls (three.js)', over: 3000 },
        raf: { caption: 'Time since last rAF (ms)', average: true, avgMs: 100 },
        rstats: { caption: 'rStats update (ms)', average: true, avgMs: 100 },
        texture: { caption: 'GenTex', average: true, avgMs: 100 }
      },
      groups: [
        { caption: 'Framerate', values: ['fps', 'raf'] },
        { caption: 'Frame Budget', values: ['frame', 'texture', 'setup', 'render'] }
      ],
      fractions: [
        { base: 'frame', steps: ['texture', 'setup', 'render'] }
      ],
      plugins: [bS, tS, glS]
    });

    this.element = window.document.getElementsByClassName('rs-base')[0];
  };

  hide() {
    this.element.style.display = 'none';
  }

  show() {
    this.element.style.display = 'block';
  }

  toggleVisibility() {
    if(this.element.style.display === 'none')
    {
      this.show();
    } else {
      this.hide();
    }
  }

  static start() {
    rS('frame').start();
    glS.start();

    rS('rAF').tick();
    rS('FPS').frame();

    rS('render').start();
  };

  static end() {
    rS('render').end(); // render finished
    rS('frame').end(); // frame finished

    // Local rStats update
    rS('rStats').start();
    rS().update();
    rS('rStats').end();
  };
}
