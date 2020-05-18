from typing import Optional

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from bson.objectid import ObjectId

from config import config


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def fix_id(vote):
    vote["_id"] = str(vote["_id"])
    return vote


@app.get("/votes/")
async def get_all_votes(status: Optional[str] = None, limit: int = 10, skip: int = 0):
    """[summary]
    Gets all votes list.
    [description]
    Endpoint for all votes.
    """
    # fake_votes=[  {"name": "Voting 1", "end_time": "", "contract_addr": "", "description": "Some testing vote 1"},
    #               {"name": "Voting 2", "end_time": "", "contract_addr": "", "description": "Some testing vote 2"}, ]

    if status is None:
        votes_cursor = config.DB.votes.find().skip(skip).limit(limit)
    else:
        votes_cursor = config.DB.votes.find(
            {"status": status.value}).skip(skip).limit(limit)

    votes = await votes_cursor.to_list(length=limit)

    return list(map(fix_id, votes))


@app.get("/votes/{vote_id}")
async def get_a_vote(vote_id: str, q: str = None):
    """[summary]
    Gets vote for one specified id .
    [description]
    Endpoint for one vote.
    """
    vote = await config.DB.votes.find_one({"_id": ObjectId(vote_id)})
    vote = fix_id(vote)
    return vote


@app.on_event("startup")
async def app_startup():
    """
    Do tasks related to app initialization.
    """
    # This if fact does nothing its just an example.
    config.load_config()


@app.on_event("shutdown")
async def app_shutdown():
    """
    Do tasks related to app termination.
    """
    # This does finish the DB driver connection.
    config.close_db_client()
