import * as reservationService from "../services/reservationService.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getUserById, getUserByEmail } from "../services/userService.js";

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

    await reservationService.createReservation(
      user_id,
      flight_id,
      agent_id,
      seats_requested
    );
    await reservationService.updateFlightSeats(flight_id, seats_requested);

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
              <br>
              <p>Thank you for booking with <strong>Adult Airlines</strong>!</p>
            `,
      });

      console.log("Confirmation email sent");
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    // Console output to check the random DB placement
    console.log("-------------------------");
    console.log("Reservation created!");
    console.log("Go check in your DB:");
    console.log(
      `Select * From reservations WHERE user_id = ${user_id} AND flight_id = ${flight_id}`
    );
    console.log("--------------------------");

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
    console.log("Reservations returned to frontend:", reservations);
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

export { getUserReservations, getAgentReservations, getUserByEmailHandler };
