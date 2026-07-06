package main

import (
	"context"
	"fmt"
	"os"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	// Copy dummy_data.json to frontend/src/pages/thermalProfile/dummy_data.json
	data, err := os.ReadFile("dummy_data.json")
	if err == nil {
		_ = os.WriteFile("frontend/src/pages/thermalProfile/dummy_data.json", data, 0644)
	}
	// Copy impedance_dummy_data.json to frontend/src/pages/impedanceProfile/impedance_dummy_data.json
	impData, err := os.ReadFile("impedance_dummy_data.json")
	if err == nil {
		_ = os.WriteFile("frontend/src/pages/impedanceProfile/impedance_dummy_data.json", impData, 0644)
	}
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// GetDummyData reads dummy_data.json and returns its content
func (a *App) GetDummyData() (string, error) {
	data, err := os.ReadFile("dummy_data.json")
	if err != nil {
		return "", err
	}
	return string(data), nil
}

// GetImpedanceDummyData reads impedance_dummy_data.json and returns its content
func (a *App) GetImpedanceDummyData() (string, error) {
	data, err := os.ReadFile("impedance_dummy_data.json")
	if err != nil {
		return "", err
	}
	return string(data), nil
}

