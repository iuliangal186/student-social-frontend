import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {Subject} from "../../model/subject.model";
import {AuthenticationService} from "../../services/authentication.service";
import {RequestService} from "../../services/request.service";

import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.scss']
})
export class AddSubjectComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddSubjectComponent>, public authenticationService: AuthenticationService,
              public requestService: RequestService, public notifier: NotifierService) {
  }

  ngOnInit(): void {
  }

  public showNotification(type: string, message: string): void {
    this.notifier.notify(type, message);
  }

  subjectSubmit(ngForm: NgForm) {
    if (ngForm.invalid) {
      return
    }
    const subject = new Subject();
    subject.name = ngForm.value.subjectName;
    subject.description = ngForm.value.subjectDescription;
    subject.userEmail = this.authenticationService.getUserEmailFromToken();

    console.log(subject);

    this.requestService.postSubject(subject).subscribe(response => {
        this.showNotification( 'success', 'Subject Created succesfully!' );
        this.close();
      },
      error => {
        this.showNotification( 'error', 'Error at subject creation.' );
      })

  }

  close() {
    this.dialogRef.close();
  }

}
