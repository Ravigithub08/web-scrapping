
var board ={
    
    notes:[],
    wrap:null,
    in_form:null,
    in_txt:null,
    btn:null,
    cur_txt:null,

    init:()=>{

            

            board.wrap=document.getElementById("board");
            board.in_form=document.getElementById("frm");
            board.in_txt=document.getElementById("text");
            board.btn=document.getElementById("btn_add");
        
        let data=localStorage.getItem("notes");
        if(data!=null){

            for(let n of JSON.parse(data) ){

                board.draw(n);

            }
        }

        board.in_form.onsubmit =()=>{return board.add();};

    },

    draw :(note, f)=>{
        
        let div=document.createElement("div");
        div.className="note";
        div.draggable=true;
        div.innerHTML =`<div class="txt"> ${note} </div> <div class="del" onclick="board.del(this.parentElement)">x</div>`;
        

        if(f){
            board.notes.unshift(div);
            board.wrap.insertBefore(div,board.wrap.firstChild);

        }else{
            board.notes.push(div);
            board.wrap.appendChild(div);


        }
        div.ondblclick=()=>{
            board.cur_txt=div.querySelector(".txt");
            for(n of board.notes){n.classList.add("lock");}
            board.in_txt.value=board.cur_txt.innerHTML;
            board.btn.value="update";
            board.in_form.onsubmit=()=>{return board.update();};
            board.in_txt.select();

        }

        div.ondragstart=(event)=>{
            board.cur_txt=event.target;
            for(let n of board.notes){
                if(n!=board.cur_txt){

                    n.classList.add("hint");
                }

            }

        }

        div.ondragenter=(event)=>{

            if(div != board.cur_txt){
                div.classList.add("active");
            
            }

        }

        div.ondragleave=(event)=>{

            div.classList.remove("active")

        }
        div.ondragend=(event)=>{
            for(let n of board.notes){
            n.classList.remove("hint");
            n.classList.remove("active");
            }
        }

        div.ondragover=(event)=>{


            event.preventDefault();
        }

        div.ondrop=(event)=>{

            event.preventDefault();
            if(board.cur_txt != event.target){
            let idrag=0;

            let idrop=0;

            for(let i=0; i<board.notes.length; i++){

                if(board.cur_txt==board.notes[i]){
                    idrag=i;
                }
                if(event.target==board.notes[i]){

                    idrop=i;

                }

            }

            if(idrag>idrop){
                board.wrap.insertBefore(board.cur_txt,event.target);


            }
            else{

                board.wrap.insertBefore(board.cur_txt,event.target.nextSibling);
            }


            board.save();
        }  

            
        }


    },

    add : ()=>{
        board.draw(board.in_txt.value,true);
        board.in_txt.value="";
        board.save();
        return false;

    },
    save : ()=>{
        let d=[];
        board.notes=[];
       
        for(let n of document.getElementsByClassName("note")){

            board.notes.push(n);
            d.push(n.querySelector(".txt").innerHTML);
            
        }
            localStorage.setItem("notes",JSON.stringify(d));
            


    },
    update:()=>{
        board.cur_txt.innerHTML=board.in_txt.value;
        board.in_txt.value="";
        board.btn.value="add";
        for(n of board.notes){n.classList.remove("lock");}
        board.save();
        return false;

    },

    del:(note)=>{if(confirm("delete?")){
           note.remove();
           board.save();

    }
    }

};
window.addEventListener("DOMContentLoaded", board.init);