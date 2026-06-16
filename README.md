# Queue Cure '26 🏥

> A real-time clinic queue management system that eliminates paper tokens and waiting room chaos.

## 🔗 Live Demo
[https://queue-cure-26-qu1e.onrender.com](https://queue-cure-26-qu1e.onrender.com)

## 🎯 Problem Statement
76% of India's 1.5 million clinics still run on paper token slips. Patients wait 2–3 hours with zero visibility. Doctors have no dashboard. Receptionists manage everything from memory.

## ✅ Solution
Queue Cure is a full-stack real-time queue management system with:
- **Receptionist View** — Add patients, call next token, set consultation time
- **Patient Waiting Room View** — Live token display, estimated wait time, queue position
- **QR Self Check-in** — Patients scan QR and add themselves to the queue
- **Analytics Dashboard** — Doctors see patients seen, avg consultation time, efficiency score
- **Multi-language Support** — English, Hindi, Tamil
- **Sound Alerts** — Chime plays when next token is called

## ⚡ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Node.js + Express |
| Real-time | Socket.io |
| Deployment | Render |

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+
- npm

### Steps
```bash
# Clone the repo
git clone https://github.com/shalini2006790/queue-cure-26.git
cd queue-cure-26

# Install dependencies
npm install --include=dev

# Start the server
node server.js
```

Open [http://localhost:4000](http://localhost:4000)

## 📁 Project Structure
## 🔄 Socket Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `add_patient` | Client → Server | Add new patient to queue |
| `call_next` | Client → Server | Call next patient token |
| `remove_patient` | Client → Server | Remove patient from queue |
| `update_avg_time` | Client → Server | Update consultation time |
| `reset_queue` | Client → Server | Reset entire queue |
| `state_update` | Server → All Clients | Broadcast updated queue state |

## 🧠 Key Features
- **AI Smart Wait Prediction** — Uses rolling average of actual consultation times instead of fixed estimate
- **Live sync** — Both screens update instantly via WebSockets, no refresh needed
- **Concurrency safe** — Server holds single source of truth, all clients receive same state
- **Mobile responsive** — Works on phone, tablet, and TV screen

## 👩‍💻 Built By
Shalini — Queue Cure '26 Hackathon (Wooble)