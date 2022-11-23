class ReservationModel {
    constructor(data) {
        this.id = data?.id;
        this.client = data?.customer;
        this.vehicle = data?.vehicle;
        this.dateFrom = data?.date_from;
        this.dateTo = data?.date_to;
        this.pickUp = data?.pickup_location;
        this.dropOff = data?.drop_off_location;
        this.totalPrice=data?.price
    }

    getClientsName(){
        return this?.client?.first_name+" "+this?.client?.last_name
    }

    getVehiclePlates(){
        return this?.vehicle?.plate_number
    }

    getPickUpName(){
        return this?.pickUp?.name
    }

    getDropOffName(){
        return this?.dropOff?.name
    }

    getFormattedDateFrom(){
        return this?.dateFrom.toString().slice(0,10)
    }

    getFormattedDateTo(){
        return this?.dateTo ? this?.dateTo.toString().slice(0,10) : ''
    }
}

export default ReservationModel;