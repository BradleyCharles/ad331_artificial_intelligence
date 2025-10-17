# AD331 Artificial Intelligence Course Platform

A comprehensive learning platform for AI, Machine Learning, and Deep Learning with Next.js frontend and FastAPI backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Option 1: Start Both Servers (Recommended)
```bash
# Cross-platform Python script (works on all systems)
python start_all.py

# Or use platform-specific scripts:
# Windows
start_all.bat

# macOS/Linux
./start_all.sh
```

This will start both the frontend and backend simultaneously!

### Option 2: Start Servers Separately

#### Frontend Setup (Next.js)
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

#### Backend Setup (FastAPI)
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start FastAPI server
python start_backend.py
```

The backend API will be available at `http://localhost:8000`


## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Responsive Design** - Mobile-first approach

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Python Libraries
- **NumPy** - Numerical computing
- **Pandas** - Data manipulation
- **Scikit-learn** - Machine learning
- **TensorFlow** - Deep learning
- **PyTorch** - Deep learning
- **Matplotlib/Seaborn** - Data visualization
- **Jupyter** - Interactive notebooks

## 📁 Project Structure

```
ad331_artificial_intelligence/
├── src/app/                    # Next.js frontend
│   ├── page.tsx               # Landing page
│   ├── week1/                 # Week 1 assignments
│   ├── week2/                 # Week 2 assignments
│   └── ...                    # Week 3-10
├── backend/                   # FastAPI backend
│   ├── main.py               # FastAPI application
│   └── requirements.txt      # Python dependencies
├── assignments/              # Python assignment files
│   ├── week1/                # Week 1 Python code
│   ├── week2/                # Week 2 Python code
│   └── ...                   # Week 3-10
├── start_backend.py          # Backend startup script
└── README.md                 # This file
```

## 🎯 Features

- **Interactive Learning Platform** - Modern web interface
- **Assignment Management** - Track progress and submissions
- **Python Integration** - Direct access to assignment files
- **FastAPI Backend** - RESTful API for data management
- **Responsive Design** - Works on all devices
- **Dark Mode Support** - Modern UI with dark/light themes

## 📖 Usage

1. **Start the Frontend**: Run `npm run dev` to start the Next.js development server
2. **Start the Backend**: Run `python start_backend.py` to start the FastAPI server
3. **Access the Platform**: Open `http://localhost:3000` in your browser
4. **Navigate Assignments**: Click on any week to view assignments and resources
5. **Work on Python Code**: Access assignment files in the `assignments/` directory

## 🔧 Development

### Adding New Assignments
1. Create Python files in the appropriate week folder under `assignments/`
2. Update the FastAPI backend in `backend/main.py` if needed
3. The frontend will automatically display new assignments

### Customizing the Backend
- Modify `backend/main.py` to add new API endpoints
- Update `backend/requirements.txt` to add new Python dependencies
- Restart the backend server to apply changes

### Styling the Frontend
- Modify components in `src/app/` directory
- Use Tailwind CSS classes for styling
- The design is fully responsive and supports dark mode

## 📝 Assignment Guidelines

Each week contains:
- **README.md** - Assignment descriptions and requirements
- **Python Files** - Implementation code
- **Jupyter Notebooks** - Interactive exercises
- **Resources** - Additional learning materials

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel or your preferred platform
```

### Backend (Python)
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run with production server
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## 📞 Support

For questions or issues:
1. Check the assignment README files
2. Review the Python code examples
3. Consult the FastAPI and Next.js documentation