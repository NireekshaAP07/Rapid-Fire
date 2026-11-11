import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db import models
from app.schemas import AgentCreate, AgentUpdate, AgentOut
from typing import List

router = APIRouter()


@router.get("/", response_model=List[AgentOut])
def list_agents(db: Session = Depends(get_db)):
    return db.query(models.Agent).order_by(models.Agent.created_at.desc()).all()


@router.get("/{agent_id}", response_model=AgentOut)
def get_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


@router.post("/", response_model=AgentOut, status_code=201)
def create_agent(payload: AgentCreate, db: Session = Depends(get_db)):
    if db.query(models.Agent).filter(models.Agent.name == payload.name).first():
        raise HTTPException(status_code=400, detail="Agent with this name already exists")
    agent = models.Agent(id=str(uuid.uuid4()), **payload.model_dump())
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent


@router.patch("/{agent_id}", response_model=AgentOut)
def update_agent(agent_id: str, payload: AgentUpdate, db: Session = Depends(get_db)):
    agent = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(agent, field, value)
    db.commit()
    db.refresh(agent)
    return agent


@router.delete("/{agent_id}")
def delete_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = db.query(models.Agent).filter(models.Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    db.delete(agent)
    db.commit()
    return {"message": "Agent deleted"}
