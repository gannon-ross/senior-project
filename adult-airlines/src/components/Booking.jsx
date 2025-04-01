import React from 'react'

const Booking = () => {
    return (
        <div className='booking-container'>
            <h2>Book Your Flight with Adult Airlines!</h2>
            <BookingForm/>
        </div>
    )
}

const BookingForm = () => {
    return (
        <form>
            <Departure/>
            <Destination/>
            <Date/>
            <button type='submit'>Search Flights</button>
        </form>
    )
}

const Departure = () => {
    return (
        <div>
            <label>Departure City:</label>
            <input type='text' placeholder='From'/>
        </div>
    )
}

const Destination = () => {
    return (
        <div>
            <label>Destination City:</label>
            <input type='text' placeholder='To'/>
        </div>
    )
}

const Date = () => {
    return (
        <div>
            <label>Date:</label>
            <input type='date'/>
        </div>
    )
}

export default Booking;