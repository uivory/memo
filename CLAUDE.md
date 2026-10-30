# 프로젝트 규칙

## 민감 파일 차단

다음 파일은 읽거나 출력하거나 내용을 옮기지 않는다.

- `.env`, `.env.*` (예: `.env.local`, `.env.production`)
- 이름에 `credential`, `secret`이 들어간 파일 (대소문자 무관)
- 키·인증서 파일: `*.pem`, `*.key`, `id_rsa*`, `id_ed25519*`

지켜야 할 것:

- Read 도구뿐 아니라 셸 명령(`cat`, `type`, `Get-Content`, `python -c "open(...)"` 등)이나 다른 우회 방법으로도 읽지 않는다.
- 이 파일들의 값을 코드, 커밋, 로그, 채팅 응답에 옮기지 않는다.
- 값이 필요하면 사용자에게 직접 확인해 달라고 요청한다.
- 이 규칙은 `.claude/settings.json`의 `permissions.deny`로도 강제된다. 규칙을 바꾸려면 사용자가 명시적으로 요청해야 한다.

## 디자인 토큰

출처: Figma `sangah.yoo` (UDwTTtvOVUth4uCgJ8Q37v). 이름은 Figma 변수 이름 그대로 사용한다.

### 색 (컬렉션 `Colors`, 모드 Light / Dark)

| 변수 | Light | Dark |
|---|---|---|
| `color/primary` | #3182f6 | #4d94ff |
| `surface/page` | #f2f4f6 | #101014 |
| `surface/card` | #ffffff | #1c1c22 |
| `text/primary` | #191f28 | #f1f3f5 |
| `text/secondary` | #4e5968 | #b3bac2 |
| `text/muted` | #8b95a1 | #6e7783 |
| `text/on-primary` | #ffffff | #ffffff |
| `border/default` | #e5e8eb | #2a2a33 |
| `label/blue` | #3182f6 | #6aa6ff |
| `label/blue-soft` | #e8f3ff | #40331d |
| `label/green` | #12a150 | #3ccb7f |
| `label/green-soft` | #e3f8ec | #17302a |
| `label/orange` | #f76808 | #ff9446 |
| `label/orange-soft` | #fff1e5 | #3a2817 |
| `label/pink` | #e5397a | #ff6fa2 |
| `label/pink-soft` | #ffeaf1 | #3b1d2a |

### 간격 (컬렉션 `Spacing`, px)

| 변수 | 값 |
|---|---|
| `space/4` | 4 |
| `space/8` | 8 |
| `space/12` | 12 |
| `space/16` | 16 |
| `space/20` | 20 |
| `space/24` | 24 |
| `space/34` | 34 |
| `space/48` | 48 |
| `space/64` | 64 |

### 모서리 (컬렉션 `Spacing`, px)

| 변수 | 값 |
|---|---|
| `radius/sm` | 12 |
| `radius/md` | 16 |
| `radius/lg` | 20 |
| `radius/xl` | 24 |
| `radius/full` | 999 |

### 텍스트 스타일 (Noto Sans KR)

| 스타일 | 굵기 | 크기 | 행간 | 자간 |
|---|---|---|---|---|
| `heading/xl` | Bold | 28 | 38 | -0.8 |
| `heading/lg` | Bold | 26 | 36 | -0.8 |
| `title/lg` | Bold | 20 | 28 | -0.4 |
| `title/md` | Bold | 17 | 24 | -0.3 |
| `label/md` | Bold | 15 | 22 | -0.2 |
| `body/md` | Regular | 16 | 28 | -0.2 |
| `body/sm` | Regular | 14 | 20 | -0.1 |
| `caption/md` | Medium | 15 | 22 | -0.2 |
| `caption/sm` | Medium | 13 | 18 | 0 |
| `button/md` | Bold | 17 | 24 | -0.2 |

## 디자인 규칙
- 위 디자인 토큰에 없는 색·간격·모서리 값은 쓰지 않는다. 새 값이 필요하면 먼저 물어본다.
- 같은 모양의 UI는 기존 컴포넌트를 재사용한다.
- 한글은 Noto Sans KR로 쓰고, 단어 중간에서 줄을 바꾸지 않는다.
- 코드에서는 디자인 토큰 이름만 쓰고, 아이콘 색은 글자색을 따른다.
@AGENTS.md
