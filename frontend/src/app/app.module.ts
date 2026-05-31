import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { QuestionCardComponent } from './components/question-card/question-card.component';
import { TagCloudComponent } from './components/tag-cloud/tag-cloud.component';
import { GithubReposComponent } from './components/github-repos/github-repos.component';
import { ModalComponent } from './components/modal/modal.component';
import { ChartComponent } from './components/chart/chart.component';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { QuestionsComponent } from './pages/questions/questions.component';
import { QuestionDetailComponent } from './pages/question-detail/question-detail.component';
import { AskQuestionComponent } from './pages/ask-question/ask-question.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';

import { TruncatePipe } from './pipes/truncate.pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { SortByDatePipe } from './pipes/sort-by-date.pipe';
import { FilterByTagPipe } from './pipes/filter-by-tag.pipe';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';

import { AuthInterceptor } from './interceptors/auth.interceptor';

import { ErrorInterceptor } from './interceptors/error.interceptor';

providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
]

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        FooterComponent,
        QuestionCardComponent,
        TagCloudComponent,
        GithubReposComponent,
        ModalComponent,
        ChartComponent,
        LoginComponent,
        RegisterComponent,
        QuestionsComponent,
        QuestionDetailComponent,
        AskQuestionComponent,
        ProfileComponent,
        AdminComponent,
        TruncatePipe,
        HighlightPipe,
        SortByDatePipe,
        FilterByTagPipe,
        SanitizeHtmlPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }