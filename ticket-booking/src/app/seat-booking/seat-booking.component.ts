/*
 * Created on Sun Dec 01 2019
 * Created by - Ritesh Kant
 *
 */

import { Component, OnInit, EventEmitter } from '@angular/core';
import { SeatServiceService } from './Services/seat-service.service';
import { Seats } from './Models/seats.model';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { UsersComponent } from '../users/users.component';

@Component({
  selector: 'app-seat-booking',
  templateUrl: './seat-booking.component.html',
  styleUrls: ['./seat-booking.component.css']
})
export class SeatBookingComponent implements OnInit {
   rows: any;
   seats:any;
   seatAvailable:any;
   reservedSeats:any;
   refresh: EventEmitter<void>;
  totalSeats = 80;
  perRow = 7;

  constructor(
    public seatService: SeatServiceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.refresh = new EventEmitter<void>();
    // Hardcoded for now to create seat arrangement for the first time
    this.rows = [];
    this.seats = [];
    this.loadData();
    this.getCurrentSeats();
    // used to refresh screen
    this.refresh.subscribe(() => {
      this.loadData();
    });
  }
  getCurrentSeats() {
    let count = 1;
    let j:any = 0;
    let row:any = ['A', 'B', 'C', 'D', 'E','F','G','H','I','J','K','L','M','N']
    for (let i = 0; i < this.totalSeats; i++) {
      if (count<=7 && this.totalSeats != i +1) {
       this.seats.push(i+1)
        count++;
      }else{
        if(this.totalSeats == i +1){
          this.seats.push(i+1)
        }
        count = 2;
        var data:any = {
          name:row[j],
          seats:this.seats
        }
        this.rows.push(data)
        this.seats = [];
        j++;
        this.seats.push(i+1)
      }
    }
  }

  /** Used to load seat details */
  public loadData() {
    this.seatService.getAllSeats().subscribe((data: any) => {
      console.log(data);
      if (data && data.length !== 0) {
        this.seatAvailable = data;
        this.getReservedSeats();
      } else {
        this.addSeatDetails();
      }
    },
      (err) => console.log('some error occured'));
  }

  /**
   * Gets all the seats which are already reserved 
   */
  private getReservedSeats() {
    this.reservedSeats = this.seatAvailable.filter(seat => seat.isSelected === true).map(seat => seat.seatNum).slice();
  }

  /** used to check whether seat is reserved or not */
  public isSeatReserved(seatNum: String) {
    if (this.reservedSeats) {
      return this.reservedSeats.includes(seatNum);
    }
    return null;
  }

  /**
   * Add seats details
   */
  public addSeatDetails() {
    const seatsNumber = [];

    this.rows.forEach((eachRow:any) => {
      eachRow.seats.forEach((eachSeat:any) => {
        seatsNumber.push(new Seats(eachRow.name.concat(eachSeat.toString()), false));
      })
    })
    this.seatService.addSeatsDetail(seatsNumber).subscribe((data: Array<Seats>) => {
      this.seatAvailable = data;
    });
  }

  /** Used to check seat staus(reserved, available) */
  public checkSeatStatus(seatNum: String) {
    if (this.seatAvailable) {
      for (let eachSeat of this.seatAvailable) {
        if (eachSeat.seatNum === seatNum) {
          return eachSeat.isSelected;
        }
      };
    }
    return false;

  }

  /**
   * used to select seat whenever user clicks on seat
   */
  public seatSelect(seatNo: String) {
    console.log(seatNo);
    this.toggleSeatSelect(seatNo);

  }

  /** Used to togle seat selection on click */
  public toggleSeatSelect(seatNo: String) {
    if (seatNo) {
      let toggleSeat = this.seatAvailable.filter(value => value.seatNum === seatNo);
      toggleSeat[0].isSelected = !toggleSeat[0].isSelected;
    }
  }

  /** Used to submit the booking details */
  private submitBooking(selectedSeats) {
    console.log('submitted',selectedSeats);
    this.seatService.bookSeat(selectedSeats).subscribe(() => {
      this.refresh.emit();
      const dialogRef = this.dialog.open(UsersComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((status) => {
    })
    });
  }
  noOfTickets(value:any){
    this.seatService.getAllSeats().subscribe((data: any) => {
        this.seatAvailable = data;
        if(value == 0){
          this.loadData();
        }
        console.log(value);
        const selectedSeats = this.seatAvailable.filter(value => !value.isSelected);
        console.log(selectedSeats,this.reservedSeats,value);
       for(let i = 0;i<value;i++){
        selectedSeats[i].isSelected = true;
       }
        console.log(this.seatAvailable);
    })
    
  }

  /** opens up popup to ask user details */
  public openDialog(): void {
    const selectedSeats = this.seatAvailable.filter(value => value.isSelected);
    // used to check if any new seat has been selected or not
    if (selectedSeats.length === this.reservedSeats.length) {
      this.snackBar.open('Please select how many seats you need to reserve', 'dismiss', { duration: 1000 });
      return;
    }
    // const dialogRef = this.dialog.open(UsersComponent, {
    //   width: '600px',
    // });
    // dialogRef.afterClosed().subscribe((status) => {
    //   if (status === 'success') {
        // this.snackBar.open('Congrats! Email sent, Please check you email', 'dismiss', {
        //   duration: 1000
        // });
        this.submitBooking(selectedSeats);
      // } else if (status === 'fail') {
      //   this.snackBar.open('Error occured. Please check your email settings/Network connection or please enable allow less secure app in gmail', 'dismiss');
      // } else {
      //   this.snackBar.open('Failed please try again', 'dismiss', {
      //     duration: 1000
      //   });
      // }

  //   },
  //     (err) => {
  //       this.snackBar.open('Error occured. Please check your email settings and please enable allow less secure app in gmail');
  //     });
  }
}
