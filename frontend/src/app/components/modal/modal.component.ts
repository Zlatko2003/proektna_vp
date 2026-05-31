import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-modal',
    template: `
        <div class="modal-overlay" *ngIf="isOpen" (click)="close()">
            <div class="modal-content" (click)="$event.stopPropagation()">
                <div class="modal-header">
                    <h3>{{ title }}</h3>
                    <button class="close-btn" (click)="close()">×</button>
                </div>
                <div class="modal-body">
                    <ng-content></ng-content>
                </div>
                <div class="modal-footer">
                    <button class="btn" (click)="close()">Cancel</button>
                    <button class="btn btn-success" (click)="confirm()">Confirm</button>
                </div>
            </div>
        </div>
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background: white;
                border-radius: 8px;
                width: 500px;
                max-width: 90%;
            }
            .modal-header {
                padding: 15px;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
            }
            .modal-body {
                padding: 20px;
            }
            .modal-footer {
                padding: 15px;
                border-top: 1px solid #ddd;
                text-align: right;
            }
            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
            }
        </style>
    `
})
export class ModalComponent {
    @Input() isOpen = false;
    @Input() title = '';
    @Output() onConfirm = new EventEmitter<void>();
    @Output() onClose = new EventEmitter<void>();

    close(): void {
        this.isOpen = false;
        this.onClose.emit();
    }

    confirm(): void {
        this.onConfirm.emit();
        this.close();
    }
}