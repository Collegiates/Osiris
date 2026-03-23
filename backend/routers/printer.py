from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from serial import Serial, SerialException
from serial.tools import list_ports

router = APIRouter(prefix="/api/printer", tags=["printer"])


class PrinterPort(BaseModel):
    port: str
    description: str


class PrinterCommandRequest(BaseModel):
    port: str = Field(..., description="Serial port path, e.g. /dev/ttyUSB0 or COM3")
    baudRate: int = Field(default=115200, ge=9600, le=1000000)
    command: Optional[str] = Field(default=None, description="Optional override for the G-code command")


class PrinterCommandResponse(BaseModel):
    status: str
    port: str
    baudRate: int
    command: str


def _sendCommand(payload: PrinterCommandRequest, defaultCommand: str) -> PrinterCommandResponse:
    command = payload.command or defaultCommand
    try:
        with Serial(payload.port, payload.baudRate, timeout=2) as serialPort:
            serialPort.write((command + "\n").encode("utf-8"))
            serialPort.flush()
    except SerialException as exc:
        raise HTTPException(status_code=500, detail=f"Serial error: {exc}") from exc
    except OSError as exc:
        raise HTTPException(status_code=500, detail=f"OS error: {exc}") from exc

    return PrinterCommandResponse(
        status="sent",
        port=payload.port,
        baudRate=payload.baudRate,
        command=command,
    )


@router.get("/ports", response_model=List[PrinterPort])
def listPrinterPorts() -> List[PrinterPort]:
    ports = list_ports.comports()
    results: List[PrinterPort] = []
    for port in ports:
        results.append(PrinterPort(port=port.device, description=port.description))
    return results


@router.post("/pause", response_model=PrinterCommandResponse)
def pausePrinter(payload: PrinterCommandRequest) -> PrinterCommandResponse:
    return _sendCommand(payload, defaultCommand="M25")


@router.post("/stop", response_model=PrinterCommandResponse)
def stopPrinter(payload: PrinterCommandRequest) -> PrinterCommandResponse:
    return _sendCommand(payload, defaultCommand="M112")
