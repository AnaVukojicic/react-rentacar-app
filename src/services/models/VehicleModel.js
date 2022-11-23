class VehicleModel {
    constructor(data) {
        this.id = data?.id;
        this.plates = data?.plate_number;
        this.year = data?.production_year;
        this.type = data?.type;
        this.seats = data?.number_of_seats;
        this.price = data?.daily_rate;
        this.note = data?.note;
    }
}

export default VehicleModel;