from app.database import Base, SessionLocal, engine
from app.models.member import Member


MEMBERS = [
    {
        "name": "전진욱",
        "role": "대표",
        "track": "백엔드, 프론트엔드, 기획/디자인",
        "detail": "컴퓨터인공지능학부",
        "image": "/assets/members/jeon-jinuk.jpeg",
    },
    {
        "name": "이주호",
        "role": "운영진",
        "track": "백엔드, 프론트엔드",
        "detail": "기계설계공학부",
        "image": "/assets/members/lee-jooho.png",
    },
    {
        "name": "허재민",
        "role": "운영진",
        "track": "기획/디자인",
        "detail": "컴퓨터인공지능학부",
        "image": None,
    },
    {
        "name": "김민령",
        "role": "회원",
        "track": "백엔드",
        "detail": "컴퓨터인공지능학부",
        "image": "/assets/members/kim-minrung.jpeg",
    },
    {
        "name": "박도현",
        "role": "회원",
        "track": "백엔드",
        "detail": "소프트웨어공학부",
        "image": None,
    },
    {
        "name": "정세빈",
        "role": "회원",
        "track": "백엔드, 프론트엔드, 기획/디자인",
        "detail": "컴퓨터공학부",
        "image": None,
    },
    {
        "name": "오성준",
        "role": "회원",
        "track": "백엔드, 프론트엔드",
        "detail": "컴퓨터인공지능학부",
        "image": "/assets/members/oh-sungjun.jpeg",
    },
    {
        "name": "김지빈",
        "role": "회원",
        "track": "백엔드",
        "detail": "컴퓨터인공지능학부",
        "image": "/assets/members/kim-jibin.jpeg",
    },
    {
        "name": "박소현",
        "role": "회원",
        "track": "백엔드",
        "detail": "컴퓨터공학부",
        "image": None,
    },
    {
        "name": "박서정",
        "role": "회원",
        "track": "기획/디자인",
        "detail": "산업정보시스템공학과",
        "image": None,
    },
    {
        "name": "최정우",
        "role": "회원",
        "track": "백엔드, 프론트엔드",
        "detail": "수학과",
        "image": "/assets/members/choi-jungwoo.jpeg",
    },
    {
        "name": "전진표",
        "role": "회원",
        "track": "백엔드, 프론트엔드",
        "detail": "컴퓨터인공지능학부",
        "image": "/assets/members/jeon-jinpyo.jpeg",
    },
]


def make_role_label(member):
    return f"{member['role']}|{member['track']}|{member['detail']}"


def seed_members():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    created = 0
    updated = 0

    try:
        for item in MEMBERS:
            member = db.query(Member).filter(Member.name == item["name"]).first()
            if member is None:
                member = Member(name=item["name"])
                db.add(member)
                created += 1
            else:
                updated += 1

            member.role_label = make_role_label(item)
            member.profile_image = item["image"]
            member.joined_year = 14

        db.commit()
    finally:
        db.close()

    print(f"Seeded members: created={created}, updated={updated}, total={len(MEMBERS)}")


if __name__ == "__main__":
    seed_members()
