import Component from "../components/Component.js";

export default class extends Component {
    controller() {
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('a[page-link]') != null) {
                e.preventDefault()
                let path = e.target.closest('a[page-link]').getAttribute('href')
                if (path != null && path.includes('#')) {
                    e.preventDefault()
                } else {
                    redirectPath(path)
                }
            } else {
                if (e.target.closest('a') != null) {
                    let path = e.target.closest('a').getAttribute('href')
                    if (path != null && path.includes('#')) {
                        e.preventDefault()
                    }
                }
            }
        })
    }

    pageConstruct() {
        // 
    }
}