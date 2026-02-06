import { Component, computed, inject, input, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonDataService } from '../../../services/commonDataService';
import { CommonService } from '../../../services/commonService';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-project-screen',
    standalone: true,
    imports: [CommonModule, ChartModule,ToastModule,ButtonModule,RippleModule],
    providers:[MessageService],
    templateUrl: './project-screen.html',
    styleUrl: './project-screen.css',
})
export class ProjectScreen implements OnInit {
    // Input binding from URL parameter :projectId
    private messageService = inject(MessageService);
    projectId = input.required<string>();
    cd = inject(ChangeDetectorRef);
    commonDataService = inject(CommonDataService);
    commonService = inject(CommonService);

    // Example of using the ID
    displayId = computed(() => `Project ID: ${this.projectId()}`);
    constructor() {

    }
      showError() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errorMessage() });
    }
    ngOnInit() {
        this.initChart();
        this.getProjectById();


    }
    // 

    data: any;
    options: any;
    platformId = inject(PLATFORM_ID);
    errorMessage=signal('');
    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
            const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

            this.data = {
                labels: ['17th', '18th', '19th', '20th', '21st', '22nd', '23rd'],
                datasets: [
                    {
                        data: [1, 5, 2, 5, 4, 1, 3],
                        label: 'Test Runs',
                        fill: true,
                        borderColor: documentStyle.getPropertyValue('--p-orange-500'),
                        tension: 0,
                        pointRadius: 6,          
                        pointHoverRadius: 8,    
                        pointBorderWidth: 2,    
                        pointBackgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
                        pointBorderColor: '#fff'
                    },

                ]
            };

            this.options = {
                maintainAspectRatio: false,
                aspectRatio: 0.6,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    }
                }
            };
            this.cd.markForCheck();
        }
    }
    getProjectById(){
        this.commonService.getProjectById(3).subscribe({
            next:(res)=>{
                if(res){
                    console.log(res,'d');
                }
                
            },
            error:(err)=>{
                console.log(err.error.message); 
                this.errorMessage.set(err.error.message)
                this.showError(); 
            }
        })
    }
}
