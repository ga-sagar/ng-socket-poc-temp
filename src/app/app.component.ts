import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ga-quiz-app-frontend';
  userId = '5f60650f1bff084312af4fdc'; // TL
  roomName = '702f9a9c-f907-11ea-adc1-0242ac120002';
  imageUrl = 'https://dummyimage.com/600x400/000/fff';

  constructor(private _socket: Socket) {
    this.joinRoom(this.userId);
    this.displayQuestion(this.imageUrl, this.roomName);
  }

  joinRoom(userId) {
    this._socket.emit('joinRoom', userId);
    this.onJoinedRoom$$();
  }

  onJoinedRoom() {
    return Observable.create((observer) => {
      this._socket.on('joinedRoom', (roomName, userId) => {
        observer.next({ roomName, userId });
      });
    });
  }

  onJoinedRoom$$() {
    this.onJoinedRoom()
      .subscribe((data: any) => {
        console.log('Joined Room Data', data);
      });
  }

  displayQuestion(imageUrl, roomName) {
    this._socket.emit('startDisplayingQuestion', imageUrl, roomName);
    this.onDisplayQuestionEvents();
  }

  onDisplayQuestionToParticipants() {
    return Observable.create((observer) => {
      this._socket.on('displayQuestionToParticipants', (data) => {
        observer.next(data);
      });
    });
  }

  onDisplayQuestionToUsers() {
    return Observable.create((observer) => {
      this._socket.on('displayQuestionToUsers', (data) => {
        observer.next(data);
      });
    });
  }

  onDisplayQuestionToAll() {
    return Observable.create((observer) => {
      this._socket.on('displayQuestionToAll', (data) => {
        observer.next(data);
      });
    });
  }

  onDisplayQuestionEvents() {
    // this event will pass data to all the socket users EXCEPT current socket user of any particular room
    this.onDisplayQuestionToParticipants().subscribe((data: any) => {
      console.log('onDisplayQuestionToParticipants =>>>>>>>>>>>', data);
    });

    // this event will pass data to all the socket users of any particular room
    this.onDisplayQuestionToUsers().subscribe((data: any) => {
      console.log('onDisplayQuestionToUsers =>>>>>>>>>>>', data);
    });

    // this event will pass data to current socket user only
    this.onDisplayQuestionToAll().subscribe((data: any) => {
      console.log('onDisplayQuestionToAll =>>>>>>>>>>>', data);
    });
  }
}
