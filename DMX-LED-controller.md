# LED Tube + T-790 Controller Setup Guide

This document summarizes the **final working setup** for controlling a 24V addressable LED tube using a **T-790 LED controller**, a **Mean Well LRS-350-24 power supply**, and a **Raspberry Pi**.

The goal is to document **connections**, **test mode**, and **next steps**, without long explanations.

---

## Hardware Used

- **LED Tube**: 24V addressable RGB LED tube (DATA + CLK type)
- **Controller**: T-790 / T-790K LED Controller (AC 100–240V input)
- **Power Supply**: Mean Well LRS-350-24 (24V DC output)
- **Controller Output Mode**: `OUT-TTL`
- **Control Device**: Raspberry Pi (Ethernet)

---

## Power Connections

### Controller Power
- The controller has an **internal power supply**
- Power it **directly from wall AC**

```
Wall Socket (AC 100–240V)
   └── IEC Power Cable
         └── Controller AC IN
```

⚠️ Do **NOT** connect the controller to the 24V PSU.

---

### LED Power
The LED tube is powered **only** by the 24V power supply.

```
Mean Well LRS-350-24
   +V (24V) ─────────▶ LED +24V
   -V (GND) ─────────▶ LED GND
```

---

## Signal Connections (Controller → LED)

Use **OUT-TTL** on the controller (NOT DMX).

### OUT-TTL Pinout
```
Pin 1: GND
Pin 2: DAT
Pin 3: (unused)
Pin 4: CLK
```

### LED (4 wires) Connection
```
LED GND   ─────────▶ Controller OUT-TTL Pin 1 (GND)
LED DATA  ─────────▶ Controller OUT-TTL Pin 2 (DAT)
LED CLK   ─────────▶ Controller OUT-TTL Pin 4 (CLK)
```

🔗 **Important**:  
LED GND must be connected to **both**:
- Power supply `-V`
- Controller `GND` (shared ground)

---

## Complete Wiring Overview

```
AC WALL POWER
   ├──▶ Controller (AC input)
   └──▶ Mean Well PSU

Mean Well PSU
   +24V ─────────▶ LED +24V
   -V   ──┬──────▶ LED GND
           └────▶ Controller GND (OUT-TTL)

Controller OUT-TTL
   DAT ─────────▶ LED DATA
   CLK ─────────▶ LED CLK
```

---

## Booting Controller into Test Mode

Test mode is used to verify wiring and LED compatibility **without a PC or Raspberry Pi**.


1. Power OFF controller
2. Hold `SET`
3. Power ON while holding
4. Release after screen changes

If LEDs animate in test mode → **hardware setup is correct**.

---

## Controller Configuration Notes

In test / software configuration:
- Output mode: **TTL**
- IC type: must match LED tube chipset
- Pixel count: number of addressable pixels in the tube
- Color order: RGB / GRB / BRG (try until correct)

---

## Next Step (Software Control)

After test mode works:
- Exit test mode
- Connect controller and Raspberry Pi to the same network
- Control LEDs via **Art-Net / sACN (E1.31)** from Raspberry Pi

---

## Key Rules (Do Not Skip)

- ❌ Do NOT power LEDs from controller
- ❌ Do NOT feed 24V into controller
- ❌ Do NOT use DMX output for TTL LEDs
- ✅ Always share GND between PSU and controller

---

## Status

✅ Hardware verified  
✅ Test mode working  
➡️ Ready for Raspberry Pi control
