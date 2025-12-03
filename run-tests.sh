#!/bin/bash

# Test runner script for SmartAudit
# Usage: ./run-tests.sh [backend|frontend|all]

set -e

COLOR_GREEN='\033[0;32m'
COLOR_BLUE='\033[0;34m'
COLOR_RED='\033[0;31m'
COLOR_RESET='\033[0m'

print_header() {
    echo -e "\n${COLOR_BLUE}========================================${COLOR_RESET}"
    echo -e "${COLOR_BLUE}$1${COLOR_RESET}"
    echo -e "${COLOR_BLUE}========================================${COLOR_RESET}\n"
}

print_success() {
    echo -e "${COLOR_GREEN}✓ $1${COLOR_RESET}"
}

print_error() {
    echo -e "${COLOR_RED}✗ $1${COLOR_RESET}"
}

run_backend_tests() {
    print_header "Running Backend Tests"
    
    if [ ! -f "requirements-test.txt" ]; then
        print_error "requirements-test.txt not found"
        exit 1
    fi
    
    print_success "Installing test dependencies..."
    pip install -q -r requirements-test.txt
    
    print_success "Running pytest..."
    pytest tests/backend/ -v --cov=api --cov-report=term-missing --cov-report=html
    
    print_success "Backend tests completed!"
    echo -e "\nCoverage report: htmlcov/index.html"
}

run_frontend_tests() {
    print_header "Running Frontend Tests"
    
    if [ ! -d "client" ]; then
        print_error "client directory not found"
        exit 1
    fi
    
    cd client
    
    print_success "Installing dependencies..."
    npm install --silent
    
    print_success "Running Jest tests..."
    npm test -- --watchAll=false --coverage
    
    cd ..
    print_success "Frontend tests completed!"
}

run_all_tests() {
    print_header "Running All Tests"
    run_backend_tests
    run_frontend_tests
    print_header "All Tests Completed!"
}

# Main execution
case "${1:-all}" in
    backend)
        run_backend_tests
        ;;
    frontend)
        run_frontend_tests
        ;;
    all)
        run_all_tests
        ;;
    *)
        echo "Usage: $0 [backend|frontend|all]"
        exit 1
        ;;
esac

