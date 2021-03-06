import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Post} from "../../../../../model/post.model";
import {Comment} from "../../../../../model/comment.model";
import {DatePipe} from "@angular/common";
import {RequestService} from "../../../../../services/request.service";
import {readSpanComment} from "@angular/compiler-cli/src/ngtsc/typecheck/src/comments";
import {SubjectService} from "../../../../../services/subject.service";
import {NotifierService} from "angular-notifier";
import {BlockRefreshService} from "../../../../../services/block.refresh.service";
import {RoleType} from "../../../../../enums/role.type";
import {MatAccordion} from "@angular/material/expansion";
import {AuthenticationService} from "../../../../../services/authentication.service";
import {MatBottomSheet,MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {DocumentsPageComponent} from "../../documents-page/documents-page.component";

// import { MatAccordion } from '@angular/material';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: Post = new Post();
  @Output() refreshPosts:EventEmitter<any> = new EventEmitter();
  public datePost: string | null = "";
  public comments: Comment[] = [];
  public userType: string = RoleType[RoleType.USER];
  public moderatorType: string = RoleType[RoleType.MODERATOR];
  public adminType: string = RoleType[RoleType.ADMIN];
  canRefresh: boolean = true;
  showCreateComment: boolean = false;
  showCommentList: boolean = false;
  openCreateComment: boolean = false;
  showFilesButton: boolean = false;
  filesNames:string[] = [];
  @ViewChild('accordion', {static: true}) Accordion: MatAccordion | undefined;

  constructor(public datepipe: DatePipe, public requestService: RequestService,
              public notifier: NotifierService, public blockRefreshService: BlockRefreshService,
              public authenticationService: AuthenticationService,public _bottomSheet: MatBottomSheet
              ) {
  }

  ngOnInit(): void {

    this.datePost = this.datepipe.transform(this.post.postDate, 'yyyy-MM-dd');
    // console.log("FISIERE?? -> :",this.post.fileName);
    // console.log("POST?? -> :",this.post);

    // console.log("file names inainte:",this.filesNames.length!=0);
    // console.log("file names inainte:",this.filesNames);

    if(this.post.fileName!=null && this.post.fileName.length>1){
      console.log(this.post.fileName);
      this.showFilesButton=true;
      console.log("problema:",this.showFilesButton)
      this.filesNames = this.post.fileName.split(',');

    }
    // this.filesNames.forEach(((value, index) => {
    //   if(value.length<2){
    //     this.filesNames.p
    //   }
    // }))
    // console.log("file names:",this.filesNames.length!=0);
    // console.log("file names:",this.filesNames);
    this.getComments();
  }

  refreshComments() {

    this.showCommentList = true;
    this.Accordion?.openAll();
    this.getComments();
  }

  addCommentClick() {
    this.showCreateComment = !this.showCreateComment;
  }

  showCommentsClick() {
    this.showCommentList = !this.showCommentList;
  }

  getComments() {
    this.requestService.getComments(this.post.id).subscribe(
      response => {
        this.comments = response;
      },
      error => {
        this.notifier.notify("error", "Could not retrieve the comment list!")
      }
    );

  }

  openCreateCommentComponent() {
    this.openCreateComment = !this.openCreateComment;
  }

  blockRefreshChangeValue() {
    // this.notifier.notify("success", "acordeonul se misca");
    this.blockRefreshService.setBlockRefresh(!this.blockRefreshService.getBlockRefresh());
  }
  deletePost(){
    this.requestService.deletePost(this.post.id).subscribe(()=>{
      this.notifier.notify("success","Post deleted!");
      this.refreshPosts.emit();
    },
    error =>{
      this.notifier.notify("error","Can't delete Post!");

    })
  }

  loggedInUserHasAuthority(){
    return (!this.authenticationService.userHasAuthority(this.userType) || (this.post.email==this.authenticationService.getUserEmailFromToken()));
  }

  openBottomSheet(){
    this._bottomSheet.open(DocumentsPageComponent,{data:{fileNames:this.filesNames, subjectId:this.post.subjectId}});
  }
}
