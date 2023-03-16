var showUpdateForm = (id, comment)=>{
    let cmnt_card = document.getElementById(id)
    
    let updateform = document.createElement("form")
    updateform.setAttribute("method", "POST")
    updateform.setAttribute("action", '#')
    updateform.setAttribute("id", "form"+id)

    let inputsection = document.createElement("input")
    inputsection.setAttribute("type", "text")
    inputsection.setAttribute("name", "comment")
    inputsection.setAttribute("value", comment)

    let submit = document.createElement("button")
    submit.setAttribute("type", "submit")
    submit.innerHTML = "submit"

    let cancel = document.createElement("button")
    cancel.setAttribute("type", "none")
    cancel.innerHTML = "cancel"

    updateform.appendChild(inputsection)
    updateform.appendChild(submit)
    updateform.appendChild(cancel)
    
    updateform.onsubmit = event => {
        formdata = new FormData(event.target)

        try{
            fetch(`${window.location.origin}/bucketprocess/updatecomment/${id.slice(4)}`, {
                method: updateform.getAttribute('method'),
                headers: {
                    'X-CSRFToken': getCsrfToken()
                  },
                body: formdata
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success){
                    throw new Error("get success:False data from django view...")
                }
                else{
                    updateform.replaceWith(cmnt_card)
                    let cmmnt_text = cmnt_card.querySelector('.cmnttext')
                    cmmnt_text.innerHTML = data.newcomment
                }
            })
        }catch(error){
            console.error(error)
        }

        return false
    }

    cmnt_card.replaceWith(updateform)
}

var deleteComment = (id)=>{
    let cmnt_card = document.getElementById(id)

    try{
        fetch(`${window.location.origin}/bucketprocess/deletecomment/${id.slice(4)}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success){
                throw new Error("get success:False data from django view...")
            }
            else{
                cmnt_card.remove()
            }
        })
    }catch(error){
        console.error(error)
    }
}

bucketid = document.getElementById("bucket-id").innerHTML
userid = document.getElementById("user-id").innerHTML

var form = document.getElementById("createcmnt")
form.onsubmit = (event) =>{
formdata = new FormData(event.target)
    try{
        fetch(`${window.location.origin}/bucketprocess/${bucketid}/createcomment/${userid}`, {
            method: form.getAttribute('method'),
            headers: {
                'X-CSRFToken': getCsrfToken()
                },
            body: formdata
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success){
                throw new Error("get success:False data from django view...")
            }
            else{
                let card = document.createElement("div")
                card.className = "card"
                card.id = `cmnt${data.id}`

                let nickname = document.createElement("div")
                nickname.className = "user-nickname"
                nickname.innerHTML = data.nickname

                let newcmnt = document.createElement("div")
                newcmnt.className = "cmnttext"
                newcmnt.innerHTML = data.newcomment

                let updatebutton = document.createElement("button")
                updatebutton.className = "updatecmnt"
                updatebutton.setAttribute("type", "button")
                updatebutton.setAttribute("onclick", `showUpdateForm('cmnt${data.id}', ${data.newcomment})`)
                updatebutton.innerHTML = "update"

                let deletebutton = document.createElement("button")
                deletebutton.className = "deletecmnt"
                deletebutton.setAttribute("type", "button")
                deletebutton.setAttribute("onclick", `deleteComment('cmnt${data.id}')`)
                deletebutton.innerHTML = "delete"

                card.appendChild(nickname)
                card.appendChild(newcmnt)
                card.appendChild(updatebutton)
                card.appendChild(deletebutton)

                let comentsection = document.getElementById("cmntsection")
                comentsection.appendChild(card)
                console.log("finish")
            }
        })
    }catch(error){
        console.error(error)
    }
    return false
}

window.onload = () => {
    const userNickname = JSON.parse(document.getElementById("user-nickname").textContent)
    let btnScraps = document.getElementsByClassName("hh-btn-scrap");
    for (let i = 0; i < btnScraps.length; ++i) {
        let bucketId = btnScraps[i].getAttribute("value");
        let title = document.getElementById("bucket-title").textContent;
        let category = document.getElementById("bucket-category").getAttribute("value");
        btnScraps[i].addEventListener("click", (event) => {
            clickScrap(bucketId, title, category, userNickname, scrapBtnChange);
            event.stopPropagation();
        });
    }

    let btnLikes = document.getElementsByClassName("hh-btn-like");
    for (let i = 0; i < btnLikes.length; ++i) {
        btnLikes[i].addEventListener("click", (event) => {
            clickLike(btnLikes[i].getAttribute("value"), userNickname, likeBtnChange);
            event.stopPropagation();
        });
    }
}