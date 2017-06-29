const app = {
   init(selectors) {
     this.flicks = []
     this.max = 0
     this.list = document
       .querySelector(selectors.listSelector)
     this.template = document
        .querySelector(selectors.templateSelector)
      document
        .querySelector(selectors.formSelector)
        .addEventListener('submit', this.handleSubmitFromForm.bind(this))
        
    this.load()
    },

    load() {
    // load the JSON from localStorage
    const flickJSON = localStorage.getItem('flicks')

    const flickArray = JSON.parse(flickJSON)
    
    // set this.flicks with the flicks from that array
    if (flickArray) {
        flickArray
            .reverse()
            .map(this.handleSubmit.bind(this))
      }
    },

    handleSubmit(flick) {
        const listItem = this.renderListItem(flick)
        this.list.insertBefore(listItem, this.list.firstChild)

        this.flicks.unshift(flick)
        this.save()

        this.max ++
    }, 

    handleSubmitFromForm(ev) {
        ev.preventDefault()

        const flick = {
            id: this.max + 1,
            name: ev.target.flickName.value,
            fav: false,
        }

        this.handleSubmit(flick)

        ev.target.reset()
    }, 

    save() {
        localStorage
            .setItem('flicks', JSON.stringify(this.flicks))
    },

    renderListItem(flick) {
        const item = this.template.cloneNode(true)
        item.classList.remove('template')
        item.dataset.id = flick.id

        item
            .querySelector('.flick-name')
            .textContent = flick.name
        
        if (flick.fav) {
            item.classList.add('fav')
        }

        item
            .querySelector('button.remove')
            .addEventListener('click', this.removeFlick.bind(this, flick))
        item
            .querySelector('button.fav')
            .addEventListener('click', this.favFlick.bind(this, flick))

        item
            .querySelector('button.move-up')
            .addEventListener('click', this.moveUp.bind(this, flick))
        item
            .querySelector('button.move-down')
            .addEventListener('click', this.moveDown.bind(this, flick))

        return item
    },

    moveDown(flick, ev) {
        const listItem = ev.target.closest('.flick')

        const index = this.flicks.findIndex((currentFlick, i) => {
            return currentFlick.id === flick.id
        })

        if (index < this.flicks.length - 1) {
            this.list.insertBefore(listItem.nextElementSibling, listItem)

            const nextFlick = this.flicks[index + 1]
            this.flicks[index + 1] = flick
            this.flicks[index] = nextFlick
            this.save()
        }
    },

    moveUp(flick, ev) {
        const listItem = ev.target.closest('.flick')

        const index = this.flicks.findIndex((currentFlick, i) => {
            return currentFlick.id === flick.id
        })

        if (index > 0) {
            this.list.insertBefore(listItem, listItem.previousElementSibling)

            const previousFlick = this.flicks[index - 1]
            this.flicks[index - 1] = flick
            this.flicks[index] = previousFlick
            this.save()
        }
    },

    favFlick(flick, ev) {
        const listItem = ev.target.closest('.flick')
        flick.fav = !flick.fav

        if (flick.fav) {
            listItem.classList.add('fav')
        } else {
            listItem.classList.remove('fav')
        }

        this.save()
    },

    removeFlick(flick, ev) {
        const listItem = ev.target.closest('.flick')
        listItem.remove()

        /*for (let i=0; i < this.flicks.length; i++) {
            const currentId = this.flicks[i].id.toString()
            if (listItem.dataset.id === currentId) {
                this.flicks.splice(i, 1)
                break;
            }
        }*/
        const i = this.flicks.indexOf(flick)
        this.flicks.splice(i, 1)

        this.save()
    },
}

app.init({
    formSelector: 'form#flick-form', 
    listSelector: '#flick-list',
    templateSelector: '.flick.template',
})
