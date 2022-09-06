/*
 * Created on Sat Nov 30 2019
 * Created by - Ritesh Kant
 *
 */
export class Seats {
    public seatNum: String;
    public isSelected: boolean;
    public rowNum : String;

    constructor(seatNum: String, isSelected: boolean,rowNum:String) {
        this.seatNum = seatNum;
        this.isSelected = isSelected;
        this.rowNum = rowNum;
    }
}