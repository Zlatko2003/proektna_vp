import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
    selector: 'app-chart',
    template: `
        <div class="chart-container">
            <canvas #chartCanvas></canvas>
        </div>
        <style>
            .chart-container {
                background: white;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                min-height: 280px;
            }
        </style>
    `
})
export class ChartComponent implements OnChanges {
    @Input() data: { labels: string[], values: number[] } = { labels: [], values: [] };
    @ViewChild('chartCanvas') chartCanvas!: ElementRef;
    private chart: any;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']) {
            setTimeout(() => this.createChart(), 50);
        }
    }

    createChart(): void {
        if (!this.chartCanvas?.nativeElement) return;

        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: this.data.labels,
                datasets: [{
                    label: 'Count',
                    data: this.data.values,
                    backgroundColor: 'rgba(99, 102, 241, 0.5)',
                    borderColor: '#6366f1',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
}