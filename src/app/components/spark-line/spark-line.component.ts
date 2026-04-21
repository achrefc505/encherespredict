import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-spark-line',
  standalone: true,
  template: `
    @if (data().length >= 2) {
      <svg [attr.width]="width()" [attr.height]="height()" style="overflow:visible;">
        <polyline [attr.points]="points()" fill="none"
          [attr.stroke]="trend() ? '#10B981' : '#EF4444'"
          stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
      </svg>
    }
  `
})
export class SparkLineComponent {
  data = input<number[]>([]);
  width = input(80);
  height = input(28);

  points = computed(() => {
    const d = this.data(), w = this.width(), h = this.height();
    if (d.length < 2) return '';
    const mn = Math.min(...d), mx = Math.max(...d), rng = mx - mn || 1;
    return d.map((v, i) => `${(i / (d.length - 1)) * w},${h - ((v - mn) / rng) * (h - 4) - 2}`).join(' ');
  });

  trend = computed(() => {
    const d = this.data();
    return d.length >= 2 && d[d.length - 1] >= d[0];
  });
}
