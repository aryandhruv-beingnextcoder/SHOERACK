#!/bin/bash
# Kill processes on ports 3000 and 5001
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
echo "Ports 3000 and 5001 cleaned up"