import * as reservationService from "../services/reservationService.js";
import * as flightService from "../services/flightService.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getUserById, getUserByEmail } from "../services/userService.js";
import { send } from "vite";

// talk with frontend and validate logic
export async function reserveFlight(req, res) {
  try {
    // Validate input
    const user_id = Number(req.body.user_id);
    const flight_id = Number(req.body.flight_id);
    const seats_requested = Number(req.body.seats_requested);
    const agent_id = req.body.agent_id || null;

    // Validate input
    if (
      isNaN(user_id) ||
      user_id <= 0 ||
      isNaN(flight_id) ||
      flight_id <= 0 ||
      isNaN(seats_requested) ||
      seats_requested <= 0
    ) {
      return res.status(400).json({
        message:
          "Invalid input. Please provide valid user_id, flight_id, and seats_requested.",
      });
    }
    //=============
    // Future: Use real data from the frontend/search
    // (uncomment here when the search is working)

    //===================

    //+++++++++++++++++
    // for testing implementation without search; random user and flight
    /*
       const randomUser = await reservationService.getRandomUser();
       const randomFlight = await reservationService.getRandomFlight();

       user_id = randomUser.id;
       flight_id = randomFlight.id;
       seats_requested = req.body.seats_requested || 1; //change value to adjust number of reservations
       */
    //++++++++++++++++++++

    const flight = await reservationService.getFlightById(flight_id);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    if (flight.total_seats < seats_requested) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const reservation = await reservationService.createReservation(
      user_id,
      flight_id,
      agent_id,
      seats_requested
    );
    await reservationService.updateFlightSeats(flight_id, seats_requested);

    const formattedBookingTime = new Date(
      reservation.booking_time
    ).toLocaleString();
    const totalPrice = flight.price * seats_requested;

    // Get user and flight info
    const user = await getUserById(user_id);
    const formattedDate = new Date(flight.departure_time).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    // Send booking confirmation
    if (!user || !user.email) {
      console.error(`Could not find email for the user_id: ${user_id}`);
      return res
        .status(404)
        .json({ message: "User not found or missing email" });
    }

    try {
      await sendEmail({
        to: user.email,
        subject: "Your Adult Airlines Booking Confirmation",
        html: `
          <h2>✈️ Reservation Confirmed!</h2>
          <p><strong>Passenger Name:</strong> ${
            user.name?.trim() || "Passenger"
          }</p>
          <p><strong>Flight:</strong> ${flight.origin} → ${
          flight.destination
        }</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Flight ID:</strong> ${flight_id}</p>
          <p><strong>Passengers:</strong> ${seats_requested}</p>
          <p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>
          <p><strong>Booking Time:</strong> ${formattedBookingTime}</p>
          <br>
          <p>Thank you for booking with <strong>Adult Airlines</strong>!</p>
        `,
      });

      console.log("Confirmation email sent");
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    // Console output to check the random DB placement
    // console.log("-------------------------");
    // console.log("Reservation created!");
    // console.log("Go check in your DB:");
    // console.log(
    //   `Select * From reservations WHERE user_id = ${user_id} AND flight_id = ${flight_id}`
    // );
    // console.log("--------------------------");

    res.status(201).json({
      message: "Reservation successful",
      user_id,
      flight_id,
      seats_requested,
    });
  } catch (error) {
    console.error("Error reserving flight:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getUserReservations(req, res) {
  const { userId } = req.params;
  try {
    const reservations = await reservationService.getReservationsByUser(userId);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Failed to fetch reservations:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getAgentReservations(req, res) {
  const { agentId } = req.params;
  try {
    const reservations = await reservationService.getReservationsByAgent(
      agentId
    );
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Failed to fetch agent reservations", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET user by email
async function getUserByEmailHandler(req, res) {
  const { email } = req.query;

  try {
    const user = await getUserByEmail(email); // from userService
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Failed to fetch user by email:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE reservation by ID
async function cancelReservation(req, res) {
  const { reservationId } = req.params;

  try {
    // Get reservation object to pass into email params
    const reservationRows = await reservationService.getReservationById(
      reservationId
    );
    const reservation = reservationRows[0];
    const flight = await reservationService.getReservationByFlight(reservation.flight_id);
    const flightInfo = flight[0];

    // Send email
    const user = await getUserById(reservation.user_id);
    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: "Your Reservation Has Been Canceled",
        html: `
          <h3>Hello, ${user.name}!</h3>
          <p>You have canceled your reservation regarding flight <strong>${flightInfo.flight_number}</strong> (${
            flightInfo.origin
        } ➔ ${flightInfo.destination}) 
          scheduled for <strong>${new Date(
            flightInfo.departure_time
          ).toLocaleString()}</strong>.</p>
          <p>We're sorry to see you go.</p>
          <p>If this was done in error, please contact an agent at your convenience.</p>
          <p>We would be glad to assist you.</p>
        `,
      });
    }

    // Cancel on backend (email won't work if done as first step: can't see a reservation that doesn't exist anymore)
    await reservationService.cancelReservationById(reservationId);

    res
      .status(200)
      .json({ message: `Reservation ${reservationId} cancelled succesfully` });
  } catch (error) {
    console.error("Failed to cancel reservation:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getAlternativeFlights(req, res) {
  const { reservationId } = req.params;

  try {
    // Step 1: Get the original reservation
    const reservationRows = await reservationService.getReservationById(
      reservationId
    );
    const reservation = reservationRows[0];

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    console.log("Finding alternatives for reservation ID:", reservationId);
    console.log("Found reservation:", reservation);
    console.log(
      "Fetching alternatives with origin:",
      reservation.origin,
      "destination:",
      reservation.destination
    );

    // Step 2: Look up flights with the same origin and destination
    const alternatives = await reservationService.findAlternativeFlights({
      origin: reservation.origin,
      destination: reservation.destination,
      excludeFlightId: reservation.flight_id,
    });

    res.status(200).json(alternatives);
  } catch (error) {
    console.error("Failed to fetch alternative flights:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function updateReservationFlight(req, res) {
  const { reservation_id, new_flight_id } = req.body;

  try {
    // 1. Get reservation + user
    const reservationRows = await reservationService.getReservationById(
      reservation_id
    );
    const reservation = reservationRows[0];

    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    const user = await getUserById(reservation.user_id);
    const newFlight = await reservationService.getFlightById(new_flight_id);

    // 2. Update reservation
    await reservationService.updateReservationFlight(
      reservation_id,
      new_flight_id
    );

    // 3. Email user
    if (user && user.email) {
      const formattedDate = new Date(
        newFlight.departure_time
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      await sendEmail({
        to: user.email,
        subject: "Flight Update Confirmation",
        html: `
          <h2>✈️ Your Flight Has Been Updated</h2>
          <p>Hi ${user.name?.trim() || "Passenger"},</p>
          <p>Your reservation has been updated to a new flight.</p>
          <ul>
            <li><strong>Route:</strong> ${newFlight.origin} → ${
          newFlight.destination
        }</li>
            <li><strong>Departure:</strong> ${formattedDate}</li>
            <li><strong>Flight ID:</strong> ${new_flight_id}</li>
          </ul>
          <p>Thanks for flying with Adult Airlines!</p>
        `,
      });
      console.log("✅ Update email sent to:", user.email);
    }

    res.status(200).json({ message: "Flight updated successfully" });
  } catch (error) {
    console.error("❌ Error updating flight:", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function cancelEntireFlight(req, res) {
  const { flight_id } = req.body;
  console.log("Body received for cancel:", req.body);

  try {
    const reservations = await reservationService.getReservationByFlight(
      flight_id
    );

    //loop through those on the canceled flight and email them
    for (const reservation of reservations) {
      const user = await getUserById(reservation.user_id);
      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: "Flight Cancellation Notice",
          html: `
            <h3>We're sorry to inform you...</h3>
            <p>Your flight <strong>${reservation.flight_number}</strong> (${
            reservation.origin
          } ➔ ${reservation.destination}) 
            scheduled for <strong>${new Date(
              reservation.departure_time
            ).toLocaleString()}</strong> has been canceled.</p>
            <p>We apologize for the inconvenience. Please contact an agent to rebook.</p>
          `,
        });
      }
      await reservationService.deleteReservationsByFlight(flight_id);
      await flightService.cancelWholeFlight(flight_id);
    }

    await flightService.cancelFlight(flight_id);
    res.status(200).json({ message: "Flight canceled and users notified" });
  } catch (error) {
    console.error("Error canceling flight:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export {
  getUserReservations,
  getAgentReservations,
  getUserByEmailHandler,
  cancelReservation,
  getAlternativeFlights,
  updateReservationFlight,
  cancelEntireFlight,
};
