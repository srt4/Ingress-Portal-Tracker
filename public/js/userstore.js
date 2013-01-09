function UserStore() {
    this.users = {};
}

UserStore.prototype.fetchAllusers = function() {
    var me = this;
    $.getJSON("/players", function(response) {
        me.setUsers(response);
    });
};

UserStore.prototype.getUsers = function() {
    return this.users;
};

UserStore.prototype.setUsers = function(users) {
    this.users = users;
};