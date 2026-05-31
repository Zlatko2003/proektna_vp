import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
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
            }
        </style>
    `
})
export class ChartComponent implements OnInit {
    @Input() data: { labels: string[], values: number[] } = { labels: [], values: [] };
    @ViewChild('chartCanvas') chartCanvas!: ElementRef;
    private chart: any;

    ngOnInit(): void {
        setTimeout(() => this.createChart(), 100);
    }

    createChart(): void {
        if (this.chart) {
            this.chart.destroy();
        }
        
        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: this.data.labels,
                datasets: [{
                    label: 'Questions per User',
                    data: this.data.values,
                    backgroundColor: 'rgba(52, 152, 219, 0.5)',
                    borderColor: '#3498db',
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